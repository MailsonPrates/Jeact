import { Router } from "../../../src/core/router/jeact-router.js";
import { State } from "../../../src/core/jeact.js";
import Home from "./pages/home.js";
import Category from "./pages/category.js";
import Placeholder from "./components/placeholder.js";
import OtherPlaceholder from "./components/other-placeholder.js";
import Login from "./pages/login.js";

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
    const root = "/Dev/Jeact/Jeact/examples/routes/completo";
    const getPath = (path) => `${root}${path}`;
    const getFilePath= (filename) => getPath(`/pages/${filename}.js`);
    const indexRoute = window.location.pathname.replace(root, "");

    console.log({indexRoute})

    return Router({
        root: root,
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
                 */
                path: "/contact", 
                handler: {
                    title: "Contact",
                    component: {
                        filename: getFilePath("contact"),
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
                                    filename: getFilePath("pedido-lista")
                                },
                                title: "Pedidos"
                            },
                        },
                        {
                            path: "/{id}",
                            handler: {
                                component: {filename: getFilePath("pedido-detalhes")},
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
                                    filename: getFilePath("pedido-imprimir"),
                                    placeholder: OtherPlaceholder
                                },
                                title: "Imprimir pedido"
                            }
                        },
                        {
                            path: "/filter",
                            handler: {
                                component: {
                                    filename: getFilePath("pedido-filter")
                                }
                            }
    
                        }
                    ]
                }
            }

        ]
    })
    .goTo(indexRoute)
    .render(DefaultPlaceholder);
}