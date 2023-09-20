import Template from "../components/template/index.js";

export default function Home(props={}){

    console.log("[Home]", {props});
    
    return Template({
        title: props.title || "",
        content: $("<div>", {
            class: "page page-home",
            html: [
                "Home - contentnetnetnetnentenndnfdnfnsfnsdfnsdfsdfs"
            ]
        })
    })

}