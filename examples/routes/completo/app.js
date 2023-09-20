import { Router } from "../../../src/core/router/jeact-router.js";
import { State } from "../../../src/core/jeact.js";
import Template from "./components/template/index.js";
import Home from "./pages/home.js";
import Category from "./pages/category.js";
import Placeholder from "./components/placeholder.js";

/**
 * 
 * @todo
 * - Import dinamic componente
 *  https://javascript.info/modules-dynamic-imports
 */

export default function App(){

    const state = State({
        route: {}
    }, "global");

    Router({
        routes: [
            {
                path: "/", 
                handler: (req) => state.set("route", {
                    request: req,
                    title: "Home",
                    component: Home.bind(this, req)
                })
            },
            {
                path: "/category", 
                handler: (req) => state.set("route", {
                    request: req,
                    title: "Category",
                    component: Category.bind(this, req)
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
                                        title: "Category",
                                        component: module.default.bind(this, req)
                                    });
                                }, 2000)
                            });

                        return Placeholder();
                    }
                })
            }
        ]
    });

    $.router.goTo("/");

    return state.render(Template);
}