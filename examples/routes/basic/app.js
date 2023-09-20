import { Router, Link } from "../../../src/core/router/jeact-router.js";
import { State } from "../../../src/core/jeact.js";


export default function App(){

    const Home = () => {

        console.log(state.route);

        return $("<div>", {
            html: "Home content dfdfdfsdfsdfdfsdf"
        });
    }

    const Category = () => $("<div>", {
        html: "Category content dfdfdfsdfsdfdfsdf"
    });

    const CategoryDetails = () => $("<div>", {
        html: "CategoryDetails content dfdfdfsdfsdfdfsdf"
    });

    const Error404 = () => $("<div>", {
        html: "Error404 content dfdfdfsdfsdfdfsdf"
    });

    const state = State({
        route: {}
    });

    const Main = () => {    
        console.log("[Main]", state.route);
        return $("<main>", {
            class: "page pages-",
            html: [
                $("<h1>", {
                    html: state.route.title || "none"
                }),
                $("<div>", {
                    class: "my-4",
                    html: state.route.component
                }),
                $("<div>", {
                    class: "mt-4 border p-3",
                    html: [
                        Link({
                            class: "btn btn-link m-2" + (state.route.request.uri == "/" ? " text-danger" : ""),
                            html: "Home",
                            title: "Home",
                            href: "/"
                        }),
                        Link({
                            class: "btn btn-link m-2" + (state.route.request.uri  == "/category" ? " text-danger" : ""),
                            html: "Category",
                            title: "Category",
                            href: "/category"
                        }),
                        Link({
                            class: "btn btn-link m-2" + (state.route.request.uri  == "/category/1234" ? " text-danger" : ""),
                            html: "Category details",
                            title: "Category details",
                            href: "/category/1234"
                        })
                    ]
                })
            ]
        })
    };

    Router({
        fallback: "/404",
        routes: [
            {"path": "/", handler: (req) => state.set("route", {
                request: req,
                title: "Home",
                component: Home
            })},

            {"path": "/category/{id}", handler: (req) => state.set("route", {
                request: req,
                title: "Category #"+req.param.id,
                component: CategoryDetails
            })},

            {"path": "/category", handler: (req) => state.set("route", {
                request: req,
                title: "Category",
                component: Category
            })},

            {"path": "/404", handler: (req) => state.set("route", {
                request: req,
                title: "404",
                component: Error404
            })}
        ]
    });

    return state.render(Main);
}