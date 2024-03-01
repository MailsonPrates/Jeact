/**
 * @param {object} props attrs
 * @returns {jQuery} <a> element
 * 
 * @todo
 * - [] Ao clicar no link, o scroll precisa subir para o topo
 */
export default function Link(props={}){
    let propsClick = props.click;

    // Remove props nao utilizadas
    // na construcao do elemento
    // ou que terá comportamento 
    // alterado
    delete props.click;

    let $link = $("<a>", props);

    $link.on("click", function(e){
        
        if ( !$.router ) return;

        e.preventDefault();

        window.scrollTo({top: 0, behavior: 'smooth'});

        let href = props.href;

        if ( href ){        
            
            // Add / no final
            href = href.endsWith('/') || href.includes("/?")
                ? href
                : href.includes("?")
                    ? href.replace('?', '/?')
                    : href + "/";
                    
            $.router.goTo(href, {}, props.title || "");
        }

        typeof propsClick == "function" && propsClick.call($link);
    });

    return $link;
}