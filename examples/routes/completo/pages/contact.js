import Template from "../components/template/index.js";

export default function Contact(props={}){

    console.log("[Contact]", props);

    return Template({
        title: props.title || "",
        content: $("<div>", {
            class: "border p-3",
            html: [
                $("<h3>", {
                    html: "Contact content"
                }),
                $("<div>", {
                    class: "input-group",
                    html: [
                        $("<input>", {
                            class: "form-control",
                        }),
                        $("<input>", {
                            class: "form-control",
                        })
                    ]
                })
            ]
        })
    });
} 