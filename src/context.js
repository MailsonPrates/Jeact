export default function Context(){

    const contexts = {
        global: {}
    };

    jQuery.contexts = contexts;

    return {

        set: function(name, state){
            contexts[name] = state;
            return contexts[name];
        },

        /**
         * 
         * @examples
         * $.context.get("global", "prop");
         * @todo $.context.get("global", "props.here");
         * @todo $.context.get("context.props.here");
         * 
         * @param {string} contextId
         * @param {string} contextProp
         */
        get: function(contextId="", contextProp=""){
            var value = contexts[contextId];
            return contextProp ? value._data[contextProp] : value;
        },

        use: function(name, hooks, index){

            var sliced = hooks.slice(0, index);

            // console.log("[Context] Use", {name, hooks, index, sliced});

            let context;

            for (let i = sliced.length - 1; i >= 0; i--) {
                let contextItem = sliced[i];
                
                if ( contextItem.context != name ) continue;

                // console.log({contextItem});

                context = contextItem;
                break;
            }
            
            return context;

        }
    }
}