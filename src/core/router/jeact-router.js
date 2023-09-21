/**
 * @ref https://github.com/kodnificent/sparouter
 * 
 * @todo
 * - [X] Implementar State proprio
 * - [X] Implementar metodo render
 * - [ ] Implementar groups (childrens)
 * - [ ] Refatorar add routes (add no init)
 * - [ ] Implementar opção de component fail default a nível de grupo ou global
 * - [ ] Implementar lang para mensagens
 * - [ ] Implementar hook para import com erro
 * - [ ] Implementar componente de placeholder default a nivel de de rota ou global
 * - [X] Implementar opção de delay minimo para os componentes dinamicos
 */

import { State } from "../jeact.js";

export function Router(props={}){

    const Configs = $.extend(true, {
        historyMode: true,
        caseInsensitive: true,
        fallback: "",
        routes: [],
        importMethod: null,
        importDelay: 1000
    }, props);

    const state = State({
        route: {}
    });

    const Query = {

        get: function(key="", props={}){
            let params = {};
            let url = props.url || window.location.search;
            let isGetAll = !key;

            if ( isGetAll ){

                props.params = props.params || {};
                let urlParts = url.split("?")[1] || "";

                if ( !urlParts ) return props.params;

                let queryParts = urlParts.split("&") || [];

                queryParts.forEach(function(item){
                    let parts = item.split("=");
                    let key = parts[0];

                    let value = Query.get(key, props);
                    let isValueList = value.indexOf(",") !== -1;

                    if ( isValueList ){
                        value = Query.getValueList(value);
                    }

                    props.params[key] = value;
                });

                return props.params;
            }

            key = key.replace(/[\[\]]/g,'\\$&');
            let regex = new RegExp('[?&]'+key+'(=([^&#]*)|&|#|$)');
            let results = regex.exec(url);

            if ( !results ) return null;

            let value = results[2];
            let isValueList = value.indexOf(",") !== -1;

            if ( isValueList ){
                value = Query.getValueList(value);
                return value;
            } 

            return value ? decodeURIComponent(results[2].replace(/\+/g,' ')) : '';
        },

        getValueList: function(value=""){
            let valueParts = value.split(",") || [];
            let valueList = [];

            valueParts.forEach(function(valueItem){
                let valueDecoded = decodeURIComponent(valueItem.replace(/\+/g,' '));
                valueList.push(valueDecoded);
            });

            return valueList;
        }
    };

    const Core = {
        routes: [],
        uris: [],
        path: "",
        query: {},

        init: function(){
            Core.initHistoryMode();
            Core.query = Query.get();
        },

        get: function(uri, handler){

            if ( !uri || typeof uri != "string" ) return;
      
            let route = {
                uri: null,
                handler: null,
                parameters: null,
                regExp: null,
                name: null,
                current: false
            }
      
            if ( Configs.caseInsensitive ) {
                uri = uri.toLowerCase()
            };

            uri = uri.startsWith("/") ? uri : `/${uri}`;

            let uriAlreadyExist = Core.uris.indexOf(uri) !== -1;

            if ( uriAlreadyExist ) return;
      
            route.uri = uri;
            route.handler = handler;
            route.parameters = Core.proccessParameters(route.uri);
      
            Core.routes.push(route);
            Core.uris.push(uri);
        },

        run: function(){

            Core.routes.forEach((route)=>{
                Core.proccessRegExp(route);
            });
      
            let found = false;
    
            /**
             * @todo refatorar - salvar obj com path pra acessa direto
             */
            Core.routes.some((route)=>{

                if ( Core.requestPath().match(route.regExp) ) {
                    route.current = true;
                    found = true;
      
                    let request = {};
                    request.param = Core.processRequestParameters(route);
                    request.query = Core.query;
                    request.uri = window.location.pathname;
      
                    state.route.request = request;

                    if ( typeof route.handler == "function" ) 
                        return route.handler(request, {set: Core.set});

                    if ( $.type(route.handler) == "object" ) 
                        return Core.set(route.handler);

                    return Core.api();
                }
            })
      
            if ( !found ){

                if ( !Configs.fallback ) return Core.api();

                let request = {};
                request.uri = window.location.pathname;

                return Core.goTo(Configs.fallback);
            }
        },

        goTo: function(url, data = {}, title =""){

            if ( !url || typeof url != "string" ) return Core.api();
      
            if ( !Configs.historyMode ){
                let storage = window.localStorage;
                storage.setItem("pushState", data);
                return window.location.href = url;
            }
      
            window.history.pushState(data, title, url);
            Core.query = Query.get();
            Core.run();

            return Core.api();
        },

        /**
         * Renderiza componente da rota
         * @param {object|function} component 
         * @param {string} component.filename
         * @param {string|function} component.placeholder
         * 
         */
        render: function(component=null){

            console.log("[Router] render", state);

            return typeof component == "function" 
                && state.render(component.bind(null, state.route));
        },

        /**
         * Ativa rota no state
         * @param {object} props
         * @param {function|object} props.component
         * @param {string} props.title
         */
        set: function(props={}){
            let routeData = $.extend(true, state.route, props);
            routeData.request.title = routeData.title;

            let isDynamicComponent = $.type(routeData.component) == "object";

            routeData.component = isDynamicComponent
                ? Core.buildDynamicComponent(routeData.component)
                : routeData.component;

            return state.set("route", routeData);
        },

        proccessParameters: function(uri){
            let parameters = [];
            let sn = 0;
      
            if ( !Core.containsParameter(uri) ) return parameters;

            uri.replace(/\{\w+\}/g,(parameter)=>{
                sn++;
                parameter.replace(/\w+/, (parameterName)=>{
                    let obj = {};
                    obj[parameterName] = {
                        sn: sn,
                        regExp: "([^\\/]+)", // catch any word except '/' forward slash
                        value: null
                    }
                    parameters.push(obj);
                });
            });
            
            return parameters;
        },

        proccessRegExp: function(route){
            let regExp = route.uri;
  
            // escape special characters
            regExp = regExp.replace(/\//g, "\\/");
            regExp = regExp.replace(/\./g, "\\.");
            regExp = regExp.replace("/", "/?");
      
            if ( Core.containsParameter(route.uri) ){
      
                //replace uri parameters with their regular expression
                regExp.replace(/{\w+}/g, (parameter)=>{
                    let parameterName = parameter.replace("{","");
                    parameterName = parameterName.replace("}","");
                    
                    route.parameters.some((i)=>{
                        if ( i[parameterName] !== undefined ) {
                            regExp = regExp.replace(parameter, i[parameterName].regExp);
                            return regExp;
                        }
                    });

                    return parameter;
                });
            }

            regExp = `^${regExp}$`;
            route.regExp = new RegExp(regExp);

            return route;
        },

        processRequestParameters(route){
            let routeMatched = Core.requestPath().match(route.regExp);
            
            if ( !routeMatched ) return;

            let param = {};
            routeMatched.forEach((value, index)=>{
                if(index !== 0){
                    let key = Object.getOwnPropertyNames(route.parameters[index - 1]);
                    param[key] = value;
                }
            });

            return param;
        },        
              
        containsParameter: function(uri){
            return uri.search(/{\w+}/g) >= 0;
        },

        requestPath: function(){
            return window.location.pathname;
        },

        initHistoryMode: function(){

            if ( !Configs.historyMode ) return;
  
            let browserSupportState = window.PopStateEvent && "pushState" in history;

            if ( !browserSupportState ) return;
    
            window.addEventListener("popstate", function(){
                Core.query = Query.get();
                Core.run();
            });
        },

        /**
         * @param {object} componentData 
         * @returns {function}
         */
        buildDynamicComponent: function(component={}){

            /**
             * @todo lidar com validacoes e erros
             */

            let methodName = "default";
            let hasFailComponent = typeof component.fail == "function";
            let hasPlaceholderComponent = typeof component.placeholder == "function";

            let componentData = component;
            let setComponent = (response={}) => Core.set({
                component: response[methodName].bind(null, state.route)
            });

            return component = () => {
                import(componentData.filename)
                .then(function(response){

                    if ( Configs.importDelay !== false ) 
                        return setTimeout(setComponent.bind(null, response), Configs.importDelay);

                }).catch(err => {
                    let message = err.message || "";
                    let FailComponent = hasFailComponent 
                        ? componentData.fail
                        /** @todo importar componente default de fail */
                        : () => $("<div>", {
                            class: "alert alert-danger", 
                            html: [
                                "Ops! Houve um erro, atualize a página e tente novamente",
                                $("<small>", {text: message})
                            ]
                        })

                        Core.set({
                            component: FailComponent.bind(null, state.route)
                        });
                });
                
                return hasPlaceholderComponent 
                    ? componentData.placeholder()
                    : $("<div>", {text: "Carregando..."});
            };
        },

        api: function(){
            return {
                get: Core.get,
                run: Core.run,
                goTo: Core.goTo,
                render: Core.render
            };
        },

    };
    
    Core.init();

    let hasRoutesOnInit = Configs.routes.length; 

    if ( hasRoutesOnInit ){

        Configs.routes.forEach(function(route){
            Core.get(route.path, route.handler);
        });

        Core.run();
    }

    let api = Core.api();
    
    $.router = api;

    return api;
}

/**
 * @param {object} props attrs
 * @returns {jQuery} <a> element
 */
export function Link(props={}){
    let propsClick = props.click;
    delete props.click;

    let $link = $("<a>", props);

    $link.on("click", function(e){
        
        e.preventDefault();

        if ( props.href ){                
            $.router.goTo(props.href, {}, props.title || "");
        }

        typeof propsClick == "function" && propsClick();
    });

    return $link;
}