/**
 *  Jeact = jQuery + ESM + reactive
 * 
 * @todo
 * - Add default value to arg initialState={}
 */

import context from "./context.js";
import syncDOM from "./syncDom.js";

let componentHooks = [];
let currentHookIndex = 0;

$.componentHooks = componentHooks;

export const Context = context();

export function State(initialState, contextName=null){

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
        ...initialState, 

        /**
         * When the user requests a state change,
         * put the new value into the pair.
         * 
         * @param {string} prop 
         * @param {mixed} value 
         */
        set: function(prop, value) {
            pair[prop] = value;
            $(pair).trigger("change");
        },

        render: function(elements=""){

            var $currentElements = elements();
            var old = $currentElements.get(0);

            $(pair).on("change", function(){
                
                console.log("[Component Change]");

                var $virtualElements = elements();
                var newEl = $virtualElements.get(0);

                syncDOM(old, newEl);
            });

            return $currentElements;
        },

        context: contextName
    };


    // Store the pair for future renders
    // and prepare for the next Hook call.
    componentHooks[currentHookIndex] = pair;
    if ( contextName ) Context.set(contextName, pair);
    currentHookIndex++;

    return pair;
}