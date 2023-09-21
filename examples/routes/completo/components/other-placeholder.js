import Template from "./template/index.js";

export default function OtherPlaceholder(){
    return Template({
        content: $("<div>", {
            class: "placeholder-glow",
            html: [
                $("<div>", {html: $("<span>", {class: "bg-primary placeholder col-6"})}),
                $("<div>", {html: $("<span>", {class: "bg-primary placeholder col-6"})}),
                $("<div>", {html: $("<span>", {class: "bg-primary placeholder col-8"})}),
                $("<div>", {html: $("<span>", {class: "bg-primary placeholder col-4"})})
            ]
        })
    })
}