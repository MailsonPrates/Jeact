/**
 * @ref https://github.com/kodnificent/sparouter
 * 
 * @todo
 * - [] Separar componentes para carregar dinamicamente, criar componente de erro default do Jeact
 * - [] Tratar erros usando new Error para trace stack
 * - [X] Implementar State proprio
 * - [X] Implementar metodo render
 * - [X] Implementar groups (childrens)
 * - [X] Refatorar add routes (add no init)
 * - [ ] Implementar componente de fail default
 * - [ ] Implementar componente de fail default a nivel de grupo
 * - [ ] Implementar componente de fail default a nivel global
 * - [ ] Implementar lang para mensagens
 * - [ ] Implementar hook para import com erro
 * - [ ] Implementar componente de placeholder default
 * - [X] Implementar componente de placeholder default a nivel de grupo
 * - [ ] Implementar componente de placeholder default a nivel global
 * - [X] Implementar opção de delay minimo para os componentes dinamicos
 * - [ ] Implementar método customizado para o import dinamico (diferente de default)
 */

import State from "./jeact-state.js";

/**
 * @param {object} props
 * @param {string} props.root
 * @param {bool} props.historyMode
 * @param {bool} props.caseInsensitive
 * @param {string} props.fallback
 * @param {array} props.routes
 * @param {int} props.importDelay
 * @param {string} props.error visible|log|none
 * @param {bool} props.debug
 * 
 * @returns {Router}
 */
export default function Router(props={}){

    const Configs = $.extend(true, {
        container: null,
        initial: window.location.pathname,
        root: false,
        historyMode: true,
        caseInsensitive: true,
        fallback: "",
        routes: [],
        importMethod: null,
        importDelay: 200,
        error: 'visible',
        debug: false
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

    const Ui = {
        fallback: () => $.div({
            html: $.div({
                css: {
                    "padding": '20px',
                    'text-align': 'center',
                    "display": 'flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    "height": '100vH'
                },
                html: [
                    $.div({
                        css: {
                            'font-weight': 'bold',
                            'font-size':' 6rem',
                        },
                        html: "404"
                    }),
                    $.div({
                        css: {
                            "color": '#bdbdbd',
                            'font-size': '45px',
                            'font-weight': '500',
                            'max-width': '260px',
                            'line-height': '40px',
                            'text-align': 'left',
                            "margin": '0 0 0 15px',
                        },
                        html: "Página não encontrada"
                    })
                ]
            })
        }),

        fail: error => $.div({
            css: {
                'padding': '10px',
                'background': '#ffe8e8',
                'color': '#941818',
                'border-radius': '7px',
                'margin': '5px'
            },
            html: [
                $.div({
                    css: {
                        'font-weight': '500'
                    },
                    html: "Ops! Houve um erro ao carregar"
                }),
                $.small({
                    html: error.message || ""
                }),
                $.div({
                    html: $.span({
                        css: {
                            'margin-top': 10,
                            'padding': '9px',
                            'background': '#fff',
                            'border-radius': '5px',
                            'color': '#941818',
                            'cursor': 'pointer',
                            'display': 'inline-block'
                        },
                        html: "Atualizar página",
                        click: () => window.location.reload()
                    })
                })
            ]
        }),

        error: (props={}) => $.div({
            css: {
                padding: 20,
                "max-width": 700
            },
            html: [
                $.div({
                    css: {
                        color: "red",
                        'font-size': "25px",
                        'font-weight': '400'
                    },
                    html: `Erro: ${props.title}`,
                }),

                props.description && $.div({
                    css: {
                        'margin-top': '15px',
                        'background': '#fafafa',
                        'padding': '30px 15px',
                        'border-radius': '10px',
                        'width': '100%',
                        'color': '#686868'
                    },
                    html: props.description
                }),

                props.solutions && $.div({
                    css: {
                        'margin-top': '15px'
                    },
                    html: function(){
                        let items = Array.isArray(props.solutions)
                            ? props.solutions
                            : [props.solutions];

                        return items.map(solution => $.div({
                            class: 'solution-item',
                            css: {
                                'margin-bottom': '8px',
                                'background': '#fff3ce',
                                'padding': '15px',
                                'border-radius': '10px',
                                'width': '100%',
                                'color': '#bb7712',
                                'display': 'flex',
                                'align-items': 'center',
                                'justify-content': 'space-between'
                                
                            },
                            html: [
                               $.span(`💡 ${solution}`),
                                $.span({
                                    css: {'cursor': 'pointer'},
                                    html: '✕',
                                    click: function(){
                                        $(this).closest(".solution-item").remove();
                                    }
                                })
                            ]
                        }))
                    }
                }),

                $.div({
                    css: {
                        'margin-top': 50,
                    },
                    html: [
                        $.div({
                            css: {"text-align": "right"},
                            html: [
                                $.span({
                                    css: {
                                        'padding': '9px',
                                        'background': '#d6ffd8',
                                        'border-radius': '5px',
                                        'color': '#4CAF50',
                                        'cursor': 'pointer'
                                    },
                                    html: "Atualizar",
                                    click: () => window.location.reload()
                                })
                            ]
                        }),
                        $.div({
                            css: {
                                'margin-top': '50px',
                                'color': '#a9a9a9',
                                'font-size': '15px',
                                'line-height': '20px',
                                'border-top': '1px solid #f0f0f0',
                                'padding-top': '12px'
                            },
                            html: "Essa tela é visível somente em ambiente de desenvolvimento e não aparecerá em produção (se estiver corretamente configurado)."
                        })
                    ]
                })
            ]
        })
    }

    const Core = {
        routes: [],
        routesIndex: {
            fixed: {},
            variable: {}
        },
        uris: [],
        path: "",
        query: {},

        init: function(){
            Core.initHistoryMode();
            Core.query = Query.get();

            let hasRoutesOnInit = Configs.routes.length; 

            if ( hasRoutesOnInit ){

                /**
                 * @todo Criar tool para gerar o mapa de rotas
                 * de forma otimizada, para prevenir os loops
                 */
                Configs.routes.forEach(function(route){
                    Core.get(route);
                });

                if ( !Configs.fallback ){
                    Core.get({
                        path: "/404",
                        handler: {
                            component: Ui.fallback
                        }
                    })
                }

                Core.run();
                
                if ( Configs.container ){
                    $(function(){
                        Core.goTo(Configs.initial, {}, "", false);
                        $(Configs.container).html(Core.render());
                    })
                }
            }
        },

        /**
         * @param {object} props 
         * @param {string} props.path
         * @param {object|function} props.handler
         * @param {object} props.group
         * @param {array} props.group.routes
         * @param {function} props.group.placeholder
         */
        get: function(props={}){

            let uri = props.path;
            let handler = props.handler;
            let group = props.group || {routes: []};
            let hasGroup = group.routes.length;

            if ( !uri || typeof uri != "string" ) return;
      
            let route = {
                uri: null,
                handler: null,
                parameters: null,
                regExp: null,
                name: null,
                current: false,
                group: group,
                data: props.data
            }
      
            if ( Configs.caseInsensitive ) {
                uri = uri.toLowerCase()
            };

            uri = uri.startsWith("/") ? uri : `/${uri}`;

            if ( hasGroup ){

                group.routes.forEach(function(chilRoute){
                    
                    let isSlashPath = chilRoute.path == "/";
                    chilRoute.path = isSlashPath ? uri : (uri + chilRoute.path);

                    let hasGroupPlaceholder = group.placeholder 
                        && chilRoute.handler 
                        && $.type(chilRoute.handler.component) == "object"
                        && !chilRoute.handler.component.placeholder;

                    if ( hasGroupPlaceholder ){
                        chilRoute.handler.component.placeholder = group.placeholder;
                    }

                    Core.get(chilRoute);
                });

                return;
            }

            let uriAlreadyExist = Core.uris.indexOf(uri) !== -1;

            if ( uriAlreadyExist ) return;
      
            route.path = uri;
            route.handler = handler;
            route.parameters = Core.proccessParameters(route.uri);
            route = Core.proccessRegExp(route);

            Core.routes.push(route);
            Core.setIndex(route);
            Core.uris.push(uri);
        },

        run: function(){

            
            const path = Core.requestPath();
            const fixedRouteFound = Core.routesIndex.fixed[path];

            Core.ifDebug('data') 
                && console.log("[Jeact Router] Routes", {
                    routes: Core.routes, 
                    routesIndex: Core.routesIndex, 
                    path, 
                    state: state.get()
                });

            if ( fixedRouteFound ) return Core.setMatch(fixedRouteFound, path);

            const pathGroup = path.split("/")[1] || '/';
            const variableRoutes = Core.routesIndex.variable[pathGroup] || [];

            Core.ifDebug('flow') 
                && console.log("[Jeact Router] Searching in variable routes...", {variableRoutes, path});

            let found = false;
            
            variableRoutes.some((route)=>{

                // console.log( Core.requestPath(), route, (Core.requestPath().match(route.regExp)))
                let match = path.match(route.regExp);

                //console.log({path: Core.requestPath(), match});

                if ( match ) {
                    found = true;
                    return Core.setMatch(route, path);
                }
            })
      
            if ( !found ){

                Core.ifDebug('flow') && console.log('[Jeact Router] Route Not Found!');

                if ( !Configs.fallback ) return Core.goTo("/404");

                let request = {};
                request.uri = window.location.pathname;

                return Core.goTo(Configs.fallback);
            }
        },

        setMatch: (route, path) => {

            Core.ifDebug('flow') && console.log("[Jeact Router] Route Matched", {route, match: true})

            route.current = true;

            let request = {};
            request.params = Core.processRequestParameters(route);
            request.data = route.data;
            request.query = Core.query;
            request.uri = path;

            state.get("route").request = request;

            if ( typeof route.handler == "function" ) 
                return route.handler(request, {set: Core.set});

            if ( $.type(route.handler) == "object" ) 
                return Core.set(route.handler);

            return Core.api();
        },

        goTo: function(url, data={}, title ="", run=true){

            if ( !url || typeof url != "string" ) return Core.api();

            url = Configs.root 
                ? `${Configs.root}${url}` 
                : url;
      
            if ( window.location.search && !url.includes("?") ){
                url = url + window.location.search;
            }

            if ( !Configs.historyMode ){
                let storage = window.localStorage;
                storage.setItem("pushState", data);
                return window.location.href = url;
            }
      
            window.history.pushState(data, title, url);
            Core.query = Query.get();
            run && Core.run();

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

            //console.log("[Router] render", {state, component});

            if ( !component || component instanceof jQuery ){
                component = route => $.div({
                    html: route.component.bind(null, route) || component || "Loading..."
                })
            }

            return typeof component == "function"
                && state.render(component.bind(null, state.get("route")));
        },

        /**
         * Ativa rota no state
         * @param {object} props
         * @param {function|object} props.component
         * @param {string} props.title
         */
        set: function(props={}){
            let routeData = $.extend(true, state.get("route"), props);
            let isDynamicComponent = $.type(routeData.component) == "object";

            routeData.component = isDynamicComponent
                ? Core.buildDynamicComponent(routeData.component)
                : routeData.component;

            return state.set("route", routeData);
        },

        setIndex: route => {

            let uri = route.uri;
            let isVariable = uri.includes("{");

            if ( !isVariable ){
                Core.routesIndex.fixed[uri] = route;
                return;
            }

            let uriParts = uri.split("/");
            let group = uriParts[1] || '/';

            if ( !Core.routesIndex.variable[group] ){
                Core.routesIndex.variable[group] = [];
            }

            Core.routesIndex.variable[group].push(route);
        },

        proccessParameters: function(uri){
            let parameters = [];
            let sn = 0;
      
            if ( !Core.containsParameter(uri) ) return parameters;

            uri.replace(/\{\w+\}/g, (parameter)=>{
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

            regExp = Configs.root 
                ? `${Configs.root}${regExp}` 
                : regExp;

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
                if ( index !== 0 ){
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

            let methodName = "default";
            let hasFailComponent = typeof component.fail == "function";
            let hasPlaceholderComponent = typeof component.placeholder == "function";

            let componentData = component;

            let mainComponent = componentData.main;

            if ( typeof mainComponent !== "function" ){
                return Core.throwError("main_component_not_found", true);
            }

            return () => {

                Core.ifDebug('flow') && console.log("[Jeact Router] Importing component...");

                mainComponent()
                    .then(function(response){

                        Core.ifDebug('flow') && console.log("[Jeact Router] Component importing Done!", response);

                        return Core.setDynamicComponent({
                            response,
                            methodName
                        })
                    })
                    .catch((error) => {

                        Core.ifDebug('flow') && console.log("[Jeact Router] Component importing Failed!", error);


                        let FailComponent = hasFailComponent
                            
                            /**
                             * @todo
                             * - Refatorar
                             */
                            ? componentData.fail()
                                .then(response => Core.setDynamicComponent({
                                    response
                                }))

                            : Ui.fail;
    
                            Core.set({
                                component: FailComponent.bind(null, error, state.get("route").request)
                            });
                    })

                return hasPlaceholderComponent && componentData.placeholder(); 
            };
        },

        /**
         * @param {object} props 
         * @param {string} props.methodName
         * @param {object} props.response
         */
        setDynamicComponent: async (props={}) => {

            if ( Configs.importDelay !== false ){
                await new Promise(r => setTimeout(r, Configs.importDelay));
            }

            let {response, methodName='default'} = props;

            let componentMethod = response[methodName] || null;

            if ( typeof componentMethod !== "function" ){
                return Core.throwError("invalid_component", {
                    methodName: methodName
                });
            }

            return Core.set({
                component: componentMethod.bind(null, state.get("route").request)
            });
        },

        throwError: function(code="unspecified", data={}){

            const request = state.get("route").request;
            data = typeof data === "boolean"
                ? {_return_component: data}
                : data;

            const isReturnComponent = data._return_component;

            if ( isReturnComponent ){
                delete data._return_component;
            }

            let isNone = Configs.error === false || Configs.error == "none";

            if ( isNone ) return;

            let isVisible = typeof Configs.error == "string" && Configs.error.includes('visible');

            const erros = {
                unspecified: {
                    title: "Houve algum erro",
                    description: "Erro não especificado"
                },
                invalid_component: {
                    title: "Componente inválido",
                    description: `Método "${data.methodName}" não encontrado`,
                    solutions: [
                        "Verifique no arquivo do componente, se o mesmo foi exportado como 'default'"
                    ]
                },
                main_component_not_found: {
                    title: "Componente não encontrado",
                    description: `Componente <i>main</i> da rota não foi encontrado`,
                    solutions: [
                        `Verifique na configuração das rotas, se foi infomado o componente 'main' para a rota ${request.uri}`
                    ]
                }
            };

            const error = erros[code || 'unspecified'];
            
            if ( !isVisible ) return;

            let errorComponent = Ui.error.bind(null, error);

            if (isReturnComponent ) return errorComponent;

            return Core.set({
                component: errorComponent
            });
        },

        ifDebug: type => {
            
            if ( Configs.debug === false ) return false;

            if ( typeof type === 'undefined' ) return true;

            const types = [
                'flow',
                'data'
            ];

            const debugTypeRequested = Array.isArray(Configs.debug)
                ? Configs.debug
                : ['flow'];
            
            return debugTypeRequested.includes(type);
        },

        api: function(){
            return {
                get: Core.get,
                run: Core.run,
                goTo: Core.goTo,
                render: Core.render
            };
        }
    };
    
    Core.init();

    let api = Core.api();
    
    $.router = api;

    return api;
}