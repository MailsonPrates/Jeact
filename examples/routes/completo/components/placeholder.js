import Template from "./template/index.js";

export default function Placeholder(){
    return Template({
        content: $("<div>", {
            class: "placeholder-glow",
            html: [
                $("<div>", {html: $("<span>", {class: "placeholder col-6"})}),
                $("<div>", {html: $("<span>", {class: "placeholder col-6"})}),
                $("<div>", {html: $("<span>", {class: "placeholder col-8"})}),
                $("<div>", {html: $("<span>", {class: "placeholder col-4"})})
            ]
        })
    })
}