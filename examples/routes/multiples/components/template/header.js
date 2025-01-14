import { Link } from "/src/index.js";

export default function Header(){

    const $brand = Link({
        class: "navbar-brand",
        href: "/",
        html: "APP"
    });

    const $items = $("<div>", {
        class: "collapse navbar-collapse",
        html: $("<ul>", {
            class: "navbar-nav me-auto mb-2 mb-lg-0",
            html: [
                $("<li>", {
                    class: "nav-item",
                    html: Link({
                        class: "nav-link",
                        href: "/login",
                        html: "Login"
                    })
                }),
                $("<li>", {
                    class: "nav-item",
                    html: Link({
                        class: "nav-link",
                        href: "",
                        html: "Link 2"
                    })
                })
            ]
        })
    });

    return $("<header>", {
        class: "template-header navbar navbar-expand-lg bg-light sticky-top",
        html: $("<div>", {
            class: "container-fluid",
            html: [
                $brand,
                $items
            ]
        })
    });
}