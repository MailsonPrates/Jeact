import { Router } from "../../../src/core/router/jeact-router.js";
import { State } from "../../../src/core/jeact.js";
import Home from "./pages/home.js";
import Category from "./pages/category.js";
import Placeholder from "./components/placeholder.js";
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
            html: route.component.bind(null, route.request) || "Loading..."
        });
    }

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
                path: "/category", 
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
                        filename: "/Dev/Jeact/Jeact/examples/routes/completo/pages/contact.js",
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
            }

        ]
    })
    .goTo("/")
    .render(DefaultPlaceholder);
}