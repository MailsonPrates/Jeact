import { Router } from "../../../src/core/router/jeact-router.js";
import { State } from "../../../src/core/jeact.js";
import Home from "./pages/home.js";
import Category from "./pages/category.js";
import Placeholder from "./components/placeholder.js";
import Login from "./pages/login.js";

console.log("[App] //");

/**
 * 
 * @todo
 * - Import dinamic componente
 *  https://javascript.info/modules-dynamic-imports
 */

export default function App(){

    console.log("[App]");

    const state = State({
        route: {}
    }, "global");

    const DefaultPlaceholder = () => {
        console.log("Defalt");

        return $("<div>", {
            html: state.route.component || "Loading..."
        });
    }

    Router({
        routes: [
            {
                path: "/", 
                handler: (req) => state.set("route", {
                    request: req,
                    title: "Home",
                    component: Home.bind(this, {req, title: "Home"})
                })
            },
            {
                path: "/category", 
                handler: (req) => state.set("route", {
                    request: req,
                    title: "Category",
                    component: Category.bind(this, {req, title: "Category"})
                })
            },
            {
                /**
                 * Dinamico
                 */
                path: "/contact", 
                handler: (req) => state.set("route", {
                    request: req,
                    title: "Contact",
                    component: function(){

                        import("./pages/contact.js")
                            .then(function(module){
                                setTimeout(function(){
                                    
                                    state.set("route", {
                                        request: req,
                                        title: "Contact",
                                        component: module.default.bind(this, {req, title: "Contact"})
                                    });
                                }, 2000)
                            });

                        return Placeholder();
                    }
                })
            },
            {
                /**
                 * Template diferente
                 */
                path: "/login",
                handler: (req) => state.set("route", {
                    request: req,
                    title: "Login",
                    component: Login.bind(this, req)
                })
            }

        ]
    });

    $.router.goTo("/");

    return state.render(DefaultPlaceholder);
}