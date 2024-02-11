(function($){

    if ( $["__jeact-util-set"] ) return;

    const Core = {
        factory: function(tag){
            $[tag] = function(arg1={}, arg2={}){
                //return $(`<${tag}>`, Core.getProps(arg1, arg2));

                let props = Core.getProps(arg1, arg2);

                if ( tag == "select" ){

                    // Transfere prop.value para props.prop.value
                    if ( typeof props.value !== "undefined" ){
                        props.prop = props.prop || {};
                        props.prop.value = props.value;
                        delete props.value;

                        return $(`<${tag}>`, props).val(props.prop.value);
                    }

                    return $(`<${tag}>`, props);
                }

                if ( tag == "input" && props.type == "checkbox" ){

                    // Transfere prop.checked para props.prop.checked
                    if ( typeof props.checked !== "undefined" ){
                        props.prop = props.prop || {};
                        props.prop.checked = props.checked;
                        delete props.checked;

                        //return $(`<${tag}>`, props).prop("checked", props.prop.checked);
                    }

                    return $(`<${tag}>`, props);
                }

                let $elem = $(`<${tag}>`, props);

                return $elem;
            };
        },

        getProps: (arg1, arg2) => {
            
            // $.div({})
            if ( $.type(arg1) == "object" ) {
                arg1.html = Core.handleHtml(arg1.html);
                return Core.convertToDataKey(arg1);
            }
            
            let typeArg2 = $.type(arg2);
            let props = {};

            // $.div("content", "class:btn-primary");
            if ( typeArg2 == "string" ){
                let parts = arg2.split(":");
                let prop = parts[0];
                props[prop] = parts[1];
            }

            // $.div("content", {class: "btn-primary"})
            if ( typeArg2 == "object" ){
                props = arg2;
            }

            props.html = Core.handleHtml(arg1);
            props = Core.convertToDataKey(props);

            return props;
        },

        convertToDataKey: props => {

            // [AINDA SEM UTILIDADE] Converte "force" em "data-force"
            /*if ( typeof props.force !== "undefined" ){
                props["data-force"] = props.force;
                delete props.force;
                //delete props.key;
            }*/

            // Converte "key" em "data-key"
            if ( props.key !== "undefined" ){
                props["data-key"] = props.key;
                delete props.key;
            }

            // Quando tiver "conditional"
            // adiciona "data-force" no primeiro elemento
            if ( props.conditional ){
                let html = props.conditional;

                if ( html[0] && html[0].setAttribute ) html[0].setAttribute("data-force", true);

                props.html = html;
                delete props.conditional;
            }

            // Converte class: ["a", "b", props.class]
            // em: class: "a b custom-class"
            // tratando valores null e undefined
            if ( Array.isArray(props.class) ){
                props.class = [].join.apply(props.class, [" "]).split("  ").join(" ");
            }

            return props;
        },

        /**
         * Add data-key quando for lista e não tiver key
         */
        handleHtml: function(content){
            return content;
            
            if ( Array.isArray(content) && content.length > 1 ){

                let len = content.length;

                for ( let i=0; i<len; i++ ){
                    let item = content[i];
                    item[0].setAttribute("data-key", i);
                    console.log({item});
                }

                return content;
            }

            return content;
        }
        

    }

    Core.factory("div");
    Core.factory("span");
    Core.factory("label");
    Core.factory("strong");
    Core.factory("h1");
    Core.factory("h2");
    Core.factory("h3");
    Core.factory("h4");
    Core.factory("img");
    Core.factory("a");
    Core.factory("nav");

    Core.factory("input");
    Core.factory("select");
    Core.factory("option");
    Core.factory("textarea");

    Core.factory("ul");
    Core.factory("li");

    $['conditional'] = function(test, elemA, elemB=null){

        if ( test ) return elemA;

        return elemB;
    }

    $['fragment'] = function(content){

        if ( typeof content == "string" ) return content;

        let isThenable = typeof content == "undefined";

        let $div = $("<div>", {
            html: isThenable ? "" : content
        });

        if ( isThenable ) {

            let $content = $.div();

            const api = {
                html: content => {
                    $content.html(content);
                    return api;
                },
                append: content => {
                    $content.append(content);
                    return api;
                },
                prepend: content => {
                    $content.prepend(content);
                    return api;
                },
                text: content => {
                    $content.text(content);
                    return api;
                },
                get: () => $content.children()
            };

            return api;
        }

        return $div.children();
    }

    /**
     * @todo .setClass
     * 
     * $.setClass("pre-class", cond === true, "true-class", "false-class");
     * $.setClass("pre-class", cond === true, "true-class");
     * 
     * $.setClass(cond === true, "true-class" : "false-class");
     * $.setClass(cond === true, "true-class");
     * 
     * $.setClass("pre-class", cond === true ? "true-class" : "false-classe");
     * $.setClass("pre-class", cond === true ? "true-class");
     * $.setClass(cond === true ? "true-class" : "false-classe");
     * $.setClass(cond === true ? "true-class");
     */


    $["__jeact-util-set"] = true;


})(jQuery)