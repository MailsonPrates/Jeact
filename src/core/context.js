export default function context(){

    const contexts = {
        global: {}
    };

    jQuery.context = contexts;

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
            return contextProp ? value[contextProp] : value;
        }
    }
}