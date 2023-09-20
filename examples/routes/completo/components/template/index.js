import { Context } from "../../../../../src/core/jeact.js";
import Header from "./header.js";
import Main from "./main.js";
import Sidebar from "./sidebar.js";

export default function Template(){

    const currentRoute = Context.get("global", "route");

    console.log("[Template]", {currentRoute});

    return $("<div>", {
        class: "template template-main",
        html: [
            Header(),
            $("<div>", {
                class: "template-content mt-3",
                html: $("<div>", {
                    class: "container-fluid",
                    html: $("<div>", {
                        class: "row",
                        html: [
                            Sidebar({
                                class: "col-md-3"
                            }),
    
                            Main({
                                class: "template-main col-md-9 bg-light p-4",
                                content: currentRoute.component,
                                title: currentRoute.title
                            })
                        ]
                    })
                })
            })
        ]
    })
}
