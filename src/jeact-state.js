/**
 * @version 0.1.0
 */

import SyncDOM from "./syncDOM.js";
import Context from "./context.js";
import core from "./core.js";
import JeactDOM from "./jeact-dom.js";

JeactDOM();

let componentHooks = [];
let currentHookIndex = 0;


const context = Context();

export default function State(initialState={}, contextName=null){

    let settings = {
    }

    let stateType = typeof initialState;

    if (stateType == "string" ){
        /**
         * @example 
         * $.State("contextName");
         * $.State("contextName", "prop");
         */
        return context.get(initialState, contextName);
    }

    if ( stateType === "function" ){
        initialState = initialState();
    }


    // How useState works inside React (simplified).
    let pair = componentHooks[currentHookIndex];

    if ( pair ) {
        
        // This is not the first render,
        // so the state pair already exists.
        // Return it and prepare for next Hook call.
        currentHookIndex++;
        return pair;
    }

    // This is the first time we're rendering,
    // so create a state pair and store it.
    //pair = [initialState, setState];
    pair = {


        /**
         * @examples
         * > state.set("prop", "value");
         * > state.set("prop", "value", false); // disable re-render
         */
        set: function(prop, value, reRender) {
            let data = core.clone(pair._data);
            core.update(pair, data, prop, value, reRender);
        },

        reset: function(props={}){
            let data = pair._initialState;
            let resetedState = {};

            for (let key in data){
                resetedState[key] = props[key] || data[key];
            }

            pair.set(resetedState);
            pair.trigger("mount");
        },

        /**
         * last param is reRender
         * 
         * @example
         * state.remove("prop", item => item.id === props.id, false);
         * state.remove("prop", "id", 123);
         */
        remove: function(){

            let args = arguments;
            let argsLen = args.length;
            let lastArg = args[argsLen - 1];

            let prop = args[0];
            let test = args[1];
            let value = args[2];

            let isTestFunction = typeof test == "function";

            let reRender = typeof lastArg == "boolean"
                ? lastArg
                : true;

            let data = pair._data[prop];
            let dataType = $.type(data);
            let updatedData;

            if ( dataType == "array" ){
                
                updatedData = data.filter(item => {

                    let keepIt = true;

                    if ( isTestFunction ){
                        keepIt = !test(item);

                    } else {
                        keepIt = !(item[test] === value);
                    }

                    return keepIt;
                })
            }

            pair.set(prop, updatedData, reRender);            
        },

        push: function(prop, value, reRender=true){
            let data = pair._data[prop];
            data.push(value);
            pair.set(prop, data, reRender);      
        },

        /**
         * @param {string} prop 
         * 
         * @todo lidar com nested
         * 
         * @return {mixed} uma cópia do valor
         */
        get: function(prop="", condition=null){
            // console.log("[PAIR]", pair._data)
            return prop ? pair._data[prop] : pair._data;
        },

        /**
         * @param {string} prop 
         * 
         * @examples
         * 
         * > Array
         * state.find("list-prop").where("id", id).set("key", "value");
         * state.find("list-prop").where("id", id).get("key", "value");
         * 
         * > Object
         * state.find("object-prop").set("key", "value");
         */
        find: function(prop){
            let data = pair._data[prop];
            let dataType = $.type(data);
            let isDataTypeObject = dataType == "object";

            if ( dataType == "array" || isDataTypeObject ) return core.findResponse(pair, prop, data, isDataTypeObject);

        },

        render: function(elements=""){

            var $currentElements = elements(pair._data);
            var oldEl = $currentElements.get(0);

            $(pair).on("change", function(){

                // Remonta elemento com state atualizado
                var $virtualElements = elements(pair._data);
                var newEl = $virtualElements.get(0);
        
                SyncDOM(oldEl, newEl);

                if ( settings.debug ) {
                    let debug = settings.debug.name 
                        ? settings.debug
                        : {name: settings.debug || ""};
      
                    console.log(`[Jeact] render ${debug.name} `, pair._data);
                }

            });

            //console.log("[Render]", oldEl, this, pair._data);

            $(pair).trigger("mount");

            return $currentElements;
        },

        /**
         * @param {string|object} name 
         * @param {function|null} callback 
         */
        on: function(name, callback=null){
            $(pair).on(name, callback);
            return pair;
        },

        trigger: function(event){
            return $(pair).trigger(event);
        },


        /**
         * @param {string} prop 
         * @param {mixed} value 
         * 
         * 
         * @todo implementar uso de objeto
         * .use({
         *   debug: {},
         *   other: {}
         *  })
         */
        use: (prop, value) => {
            settings[prop] = value;

            return pair;
        },

        /**
         * Shorcut
         */
        //mount: () => pair.trigger("mount"),

        context: contextName,

        _data: initialState,
        _initialState: initialState
    };


    // Store the pair for future renders
    // and prepare for the next Hook call.
    componentHooks[currentHookIndex] = pair;

    if ( contextName ) context.set(contextName, pair);

    currentHookIndex++;

    return pair;
}