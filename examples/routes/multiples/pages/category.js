import Template from "../components/template/index.js";

export default function Category(props={}){

    console.log("[Category]", {props});
    
    return Template({
        title: props.title || "",
        content: $("<div>", {
            class: "page page-home",
            html: [
               $("<div>", {
                    html: "Category - dfdfsdfsdfsdfdfdf"
               }),
               $("<p>", {
                    html: "Category - dfdfsdfsdfsdfdfdf"
                }),
                $("<span>", {
                    html: "Category - dfdfsdfsdfsdfdfdf"
                })
            ]
        })
    })
}