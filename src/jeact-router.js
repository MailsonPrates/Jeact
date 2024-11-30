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
 * @param {string} props.documentTitle
 * @param {bool} props.caseInsensitive
 * @param {string} props.fallback
 * @param {array} props.routes
 * @param {int} props.importDelay
 * @param {string} props.error visible|log|none
 * @param {bool} props.debug
 * @param {bool} props.env
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
        fallback: null,
        defaultComponents: {},
        routes: [],
        importMethod: null,
        importDelay: 200,
        error: 'visible',
        debug: false,
        documentTitle: '',
        env: 'dev'
    }, props);

    const state = State({
        route: {}
    });

    const LocalState = {
        prevPath: window.location.pathname
    };

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

        /**
         * @param {object} props 
         * @param {string} props.title
         * @param {string} props.description
         * @param {string|array} props.solutions
         */
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
                    html: props.title,
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
                    html: function(){

                        let type = $.type(props.description);

                        if ( ['string', 'array'].includes(type) ) return props.description;

                        if ( type == 'object' ){

                            let {element, file, line} = props.description;

                            return [
                                $.div([
                                    $.span({
                                        css: {'font-weight': 500, 'margin-right': 5},
                                        html: "Elemento:"
                                    }),
                                    $.span(element)
                                ]),
                                $.div([
                                    $.span({
                                        css: {'font-weight': 500, 'margin-right': 5},
                                        html: "Arquivo:"
                                    }),
                                    $.span(file)
                                ]),
                                $.div([
                                    $.span({
                                        css: {'font-weight': 500, 'margin-right': 5},
                                        html: "Linha:"
                                    }),
                                    $.span(line)
                                ])
                            ]
                        }
                    }
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
        paths: [],
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

                Core.run();
                
                if ( Configs.container ){
                    $(function(){
                        Core.goTo(Configs.initial, {}, "", false);
                        $(Configs.container).html(Core.render());
                        console.log({routes: Core.routes})
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

            let path = props.path;
            let handler = props.handler;
            let group = props.group || {routes: []};
            let hasGroup = group.routes.length;

            if ( !path || typeof path != "string" ) return;
      
            let route = {
                path: null,
                handler: null,
                parameters: null,
                regExp: null,
                name: null,
                current: false,
                group: group,
                custom: props.custom,
                title: props.title,
            }
      
            if ( Configs.caseInsensitive ) {
                path = path.toLowerCase()
            };

            path = path.startsWith("/") ? path : `/${path}`;

            if ( hasGroup ){

                group.routes.forEach(function(chilRoute){
                    
                    let isSlashPath = chilRoute.path == "/";
                    chilRoute.path = isSlashPath ? path : (path + chilRoute.path);

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

            let pathAlreadyExist = Core.paths.indexOf(path) !== -1;

            if ( pathAlreadyExist ) return;


            route.path = path;
            route.handler = handler;
            route.parameters = Core.proccessParameters(route.path);
            route = Core.proccessRegExp(route);

            Core.routes.push(route);
            Core.setIndex(route);
            Core.paths.push(path);
        },

        run: function(){

            const path = Core.requestPath();
            const fixedRouteFound = Core.routesIndex.fixed[path];

            Core.isDebug('data') 
                && console.log("[Jeact Router] Routes", {
                    routes: Core.routes, 
                    routesIndex: Core.routesIndex, 
                    path, 
                    state: state.get()
                });

            if ( fixedRouteFound ) return Core.setMatch(fixedRouteFound, path);

            const pathGroup = path.split("/")[1] || '/';
            const variableRoutes = Core.routesIndex.variable[pathGroup] || [];

            Core.isDebug('flow') 
                && console.log("[Jeact Router] Searching in variable routes...", {variableRoutes, path});

            let found = false;
            
            variableRoutes.some((route) => {

                // console.log( Core.requestPath(), route, (Core.requestPath().match(route.regExp)))
                let match = path.match(route.regExp);

                //console.log({path: Core.requestPath(), match});

                if ( match ) {
                    found = true;
                    return Core.setMatch(route, path);
                }
            })

            if ( !found ){

                Core.isDebug('flow') && console.log('[Jeact Router] Route Not Found!');

                if ( typeof Configs.fallback == 'function' ){
                    return Core.set({
                        component: {
                            main: Configs.fallback
                        }
                    })
                }

                return Core.throwError("no_fallback_route");
            }
        },

        setMatch: (route, path) => {

            Core.isDebug('flow') && console.log("[Jeact Router] Route Matched", {route, match: true})

            route = Core.processRequestParameters(route);
            route.current = true;

            let request = {};
            request.params = route.params;
            request.custom = route.custom;
            request.title = route.title;
            request.query = Core.query;
            request.path = path;

            document.title = Core.getDocumentTitle(route.title);

            state.get("route").request = request;

            //console.log({route, path, handler: route.handler})

             /**
             * Verifica permissão se houver
             */
            if ( Configs.permissions ){
                let isForbidden = Configs.permissions.validator(route);

                if ( !isForbidden ){
                    route.handler = {
                        component: {
                            main: Configs.permissions.forbidden
                        } 
                    };
                }
            }

            if ( typeof route.handler == "function" ) 
                return route.handler(request, {set: Core.set});

            if ( $.type(route.handler) == "object" ){

                let isSamePath = LocalState.prevPath == path;

                // console.log({LocalState, isSamePath, revalited: route.handler.revalidate})

                if ( LocalState.isRevalidatedPath ){
                    window.location.href = path;
                    return;
                } 

                if ( route.handler.revalidate ) {
    
                    // Quando é o path que precisa revalidar
                    // não faz nada, do contrário, redireciona
                    if ( !isSamePath ) {
                        window.location.href = path;
                        return;
                    }

                    // Quando a rota atual é do tipo que 
                    // precisa ser revalidada, adiciona essa flag
                    // para fazer um redirect de volta para uma rota
                    // para outra rota que não revalida
                    LocalState.isRevalidatedPath = true;
                }

                return Core.set(route.handler);
            }
                

            return Core.api();
        },

        goTo: function(url, data={}, title =null, run=true){

            if ( !url || typeof url != "string" ) return Core.api();

            LocalState.prevPath = window.location.pathname;

            url = Configs.root 
                ? `${Configs.root}${url}` 
                : url;
      
            if ( window.location.search && !url.includes("?") ){
                url = url + window.location.search;
            }

            if ( !Configs.historyMode ){
                console.log("[AQUI....]")
                let storage = window.localStorage;
                storage.setItem("pushState", data);
                return window.location.href = url;
            }
      
            console.log(':: goTo', {url, data});

            window.history.pushState(data, title, url);

            Core.query = Query.get();
            run && Core.run();

            console.log(Core.query)

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

            Core.isDebug('flow')  && console.log("[Router] render", {state, component});

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

            let path = route.path;
            let isVariable = path.includes("{");

            if ( !isVariable ){
                Core.routesIndex.fixed[path] = route;
                return;
            }

            let pathParts = path.split("/");
            let group = pathParts[1] || '/';

            if ( !Core.routesIndex.variable[group] ){
                Core.routesIndex.variable[group] = [];
            }

            Core.routesIndex.variable[group].push(route);
        },

        proccessParameters: function(path){
            let parameters = [];
            let sn = 0;
      
            if ( !Core.containsParameter(path) ) return parameters;

            path.replace(/\{\w+\}/g, (parameter)=>{
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
            let regExp = route.path;

            regExp = Configs.root 
                ? `${Configs.root}${regExp}` 
                : regExp;

            // escape special characters
            regExp = regExp.replace(/\//g, "\\/");
            regExp = regExp.replace(/\./g, "\\.");
            regExp = regExp.replace("/", "/?");
      
            if ( Core.containsParameter(route.path) ){
      
                //replace path parameters with their regular expression
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

            let params = {};
            let title = route.title || '';
            
            if ( routeMatched ){
                
                routeMatched.forEach((value, index)=>{
                    if ( index !== 0 ){
                        let key = Object.getOwnPropertyNames(route.parameters[index - 1]);
                        console.log({routeMatched, key, value});
                        params[key] = value;
                        title = title.replace(`{${key}}`, value);
                    }
                });
            }

            route.params = params;
            route.title = title;

            return route;
        },        
              
        containsParameter: function(path){
            return path.search(/{\w+}/g) >= 0;
        },

        requestPath: function(){
            return window.location.pathname;
        },

        getDocumentTitle: routeTitle => {

            let title = routeTitle || '';
            let subtitle = Configs.documentTitle || 'App';

            return title
                ? `${title} | ${subtitle}`
                : subtitle;
        },

        initHistoryMode: function(){

            if ( !Configs.historyMode ) return;
  
            let browserSupportState = window.PopStateEvent && "pushState" in history;

            if ( !browserSupportState ) return;
    
            window.addEventListener("popstate", function(e){
                console.log({e}, window.location.pathname);
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
            let hasPlaceholderComponent = typeof component.placeholder == "function";

            let componentData = component;

            let mainComponent = componentData.main;

            if ( typeof mainComponent !== "function" ){
                return Core.throwError("main_component_not_found", true);
            }

            return () => {

                Core.isDebug('flow') && console.log("[Jeact Router] Importing component...");

                mainComponent()
                    .then(function(response){

                        Core.isDebug('flow') && console.log("[Jeact Router] Component importing Done!", response);

                        return Core.setDynamicComponent({
                            response,
                            methodName
                        })
                    })
                    .catch((error) => {

                        console.error("[Jeact Router] Component importing Failed!", error);

                        let errorData = Core.getCompileErroData(error);

                        if ( Core.isDev() ) return Core.throwError({
                            title: errorData.message,
                            notes: ["Verifique o console do navegador para mais informações"],
                            description: {
                                element: errorData.element,
                                file: errorData.file,
                                line: errorData.line
                            }
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

        /**
         * @param {string|object} code 
         * @param {bool|object} data 
         */
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
                unspecified: () => {
                    return {
                        title: "Erro: Houve um erro desconhecido",
                        description: "Erro não especificado"
                    }
                },
                invalid_component: () => {
                    return {
                        title: "Erro: Componente inválido",
                        description: `Método "${data.methodName}" não encontrado`,
                        solutions: [
                            "Verifique no arquivo do componente, se o mesmo foi exportado como 'default'"
                        ]
                    }
                },
                main_component_not_found: () =>{
                    return {
                        title: "Erro: Componente não encontrado",
                        description: `Componente <i>main</i> da rota não foi encontrado`,
                        solutions: [
                            `Verifique na configuração das rotas, se foi infomado o componente 'main' para a rota ${request.path}`
                        ]
                    }
                },
                no_fallback_route: () => {
                    return {
                        title: "Erro: 404!",
                        description: `Nenhum componente definido para a rota ${window.location.pathname}`,
                        solutions: [
                            "Verifique se a rota acima existe ou se foi definido um component fallback configurações do Jeact Router"
                        ]
                    }
                }
            };

            const isObjError = $.type(code) == "object";

            const error = isObjError 
                ? {
                    title: code.title, 
                    description: code.description,
                    solutions: code.notes
                }
                : erros[code || 'unspecified']();
            
            if ( !isVisible ) return;

            let errorComponent = Ui.error.bind(null, error);

            if ( isReturnComponent ) return errorComponent;

            return Core.set({
                component: errorComponent
            });
        },

        getCompileErroData: (error={}) => {

            let response = {
                element: 'Não identificado',
                file: 'Não identificado',
                message: 'Erro desconhecido',
                line: 'Não identificado'
            };

            try {
                let errorParts = error.stack.split('\n');
                let message = errorParts[0];
                let componentDataParts = errorParts[1].trim().split(' ') || [];
                let element = componentDataParts[1] || 'Não identificado';
                let filename = componentDataParts[2] || '';
                let filenameParts = filename.split('./')[1].split('?:');
                let file = filenameParts[0];
                let line = filenameParts[1].split(':')[0];

                response.message = message;
                response.element = element;
                response.file = file;
                response.line = line;

            } catch (error) {}

            return response;
        },

        isDebug: type => {
            
            if ( Configs.debug === false || !Core.isDev() ) return false;

            if ( Configs.debug === true ) return true;

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

        isDev: () => Configs.env.toLowerCase() == 'dev',

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