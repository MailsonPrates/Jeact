/**
 * @ref https://github.com/kodnificent/sparouter
 */

export function Router(props={}){

    const Configs = $.extend(true, {
        historyMode: true,
        caseInsensitive: true,
        fallback: "",
        routes: []
    }, props);

    //const RouteState = State({});

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

        get: function(uri, callback){

            if ( !uri || typeof uri != "string" ) return;
            if ( typeof callback != "function") return;
      
            let route = {
                uri: null,
                callback: null,
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
            route.callback = callback;
            route.parameters = Core.proccessParameters(route.uri);
      
            Core.routes.push(route);
            Core.uris.push(uri);
        },

        run: function(){

            Core.routes.forEach((route)=>{
                Core.proccessRegExp(route);
            });
      
            let found = false;
    
            Core.routes.some((route)=>{

                if ( Core.requestPath().match(route.regExp) ) {
                    route.current = true;
                    found = true;
      
                    let request = {};
                    request.param = Core.processRequestParameters(route);
                    request.query = Core.query;
                    request.uri = window.location.pathname;
      
                    return route.callback(request);
                }
            })
      
            if ( !found ){

                if ( !Configs.fallback ) return;

                let request = {};
                request.uri = window.location.pathname;

                return Core.goTo(Configs.fallback);
            }
        },

        goTo: function(url, data = {}, title =""){

            if ( !url || typeof url != "string" ) return;
      
            if ( !Configs.historyMode ){
                let storage = window.localStorage;
                storage.setItem("pushState", data);
                return window.location.href = url;
            }
      
            window.history.pushState(data, title, url);
            Core.query = Query.get();
            return Core.run();
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
        }
    };
    
    Core.init();

    let hasRoutesOnInit = Configs.routes.length; 

    if ( hasRoutesOnInit ){

        Configs.routes.forEach(function(route){
            Core.get(route.path, route.handler);
        });

        Core.run();
    }

    let api = {
        get: Core.get,
        run: Core.run,
        goTo: Core.goTo
    };
    
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