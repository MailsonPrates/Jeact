import { Link } from "../../../../../src/router.js";

export default function Sidebar(props={}){

    let elements = [
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
                href: "/category/category-slug",
                html: "Categoria"
            })
        }),
        $("<li>", {
            class: "list-group-item",
            html: Link({
                href: "/pedidos",
                html: "Pedidos"
            })
        }),
        $("<li>", {
            class: "list-group-item",
            html: Link({
                href: "/pedidos/filter",
                html: "-- Pedidos filtro"
            })
        }),
        $("<li>", {
            class: "list-group-item",
            html: Link({
                href: "/pedidos/123",
                html: "-- Pedido 123"
            })
        }),
        $("<li>", {
            class: "list-group-item",
            html: Link({
                href: "/pedidos/123/imprimir",
                html: "---- Imprimir pedido 123"
            })
        }),
        $("<li>", {
            class: "list-group-item",
            html: Link({
                href: "/contact",
                html: "Contato"
            })
        })
    ];

    for ( var i=0; i<300; i++ ){
        elements.push($("<li>", {
            class: "list-group-item",
            html: Link({
                href: `/pedidos/${i}`,
                html: `Pedido #${i}`
            })
        }));
    }

    return $("<aside>", {
        class: "template-sidebar"+(props.class ? " "+props.class : ""),
        html: $("<ul>", {
            class: "list-group",
            html: elements
        })
    })

}