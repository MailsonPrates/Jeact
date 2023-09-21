import { Router } from "../../../src/core/router/jeact-router.js";
import { State } from "../../../src/core/jeact.js";
import Home from "./pages/home.js";
import Category from "./pages/category.js";
import Placeholder from "./components/placeholder.js";
import OtherPlaceholder from "./components/other-placeholder.js";
import Login from "./pages/login.js";

/**
 * 
 * @todo
 * - Import dinamic componente
 *  https://javascript.info/modules-dynamic-imports
 */

export default function App(){

    console.log("[App]");

    const state = State({
    }, "global");

    const DefaultPlaceholder = (route) => {
        console.log("[Default]", route);

        return $("<div>", {
            html: route.component.bind(null, route) || "Loading..."
        });
    }

    // local only
    const getPath = (filename) => `/Dev/Jeact/Jeact/examples/routes/completo/pages/${filename}.js`;

    return Router({
        routes: [
            {
                /**
                 * @example Handler como função
                 */
                path: "/", 
                handler: (req, route) => route.set({
                    title: "Home",
                    component: Home
                })
            },
            {
                /**
                 * @example Handler como objeto
                 */
                path: "/category/{name}", 
                handler: {
                    title: "Category",
                    component: Category
                }
            },
            {
                /**
                 * @example Handler com componente dinamico
                 * @todo
                 * - Implementar componente de erro customizado
                 * - Implementar placeholder filename
                 * - Implementar método import customizado
                 */
                path: "/contact", 
                handler: {
                    title: "Contact",
                    component: {
                        filename: getPath("contact"),
                        placeholder: Placeholder,
                        //fail: Fail
                    }
                }
            },
            {
                /**
                 * @example Template diferente
                 */
                path: "/login",
                handler: {
                    component: Login
                }
            },
            {
                /**
                 * @example Rotas agrupadas
                 */
                path: "/pedidos",
                group: {
                    placeholder: Placeholder,
                    routes: [
                        {
                            path: "/",
                            handler: {
                                component: {
                                    filename: getPath("pedido-lista")
                                },
                                title: "Pedidos"
                            },
                        },
                        {
                            path: "/{id}",
                            handler: {
                                component: {filename: getPath("pedido-detalhes")},
                                title: "Pedido detalhes"
                            }
                        },
                        {
                            /**
                             * @example Ignore group placeholder
                             */
                            path: "/{id}/imprimir",
                            handler: {
                                component: {
                                    filename: getPath("pedido-imprimir"),
                                    placeholder: OtherPlaceholder
                                },
                                title: "Imprimir pedido"
                            }
                        },
                        {
                            path: "/filter",
                            handler: {
                                component: {
                                    filename: getPath("pedido-filter")
                                }
                            }
    
                        }
                    ]
                }
            }

        ]
    })
    .goTo("/")
    .render(DefaultPlaceholder);
}