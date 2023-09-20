import { Link } from "../../../../../src/core/router/jeact-router.js";

export default function Sidebar(props={}){

    return $("<aside>", {
        class: "template-sidebar"+(props.class ? " "+props.class : ""),
        html: $("<ul>", {
            class: "list-group",
            html: [
                $("<li>", {
                    class: "list-group-item",
                    html: Link({
                        href: "/",
                        html: "Home"
                    })
                }),
                $("<li>", {
                    class: "list-group-item",
                    html: Link({
                        href: "/category",
                        html: "Categoria"
                    })
                }),
                $("<li>", {
                    class: "list-group-item",
                    html: Link({
                        href: "/contact",
                        html: "Contato"
                    })
                }),
            ]
        })
    })

}