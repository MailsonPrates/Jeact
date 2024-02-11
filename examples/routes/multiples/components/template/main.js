export default function Main(props={}){

    return $("<div>", {
        class: "template-main"+(props.class ? " "+props.class : ""),
        html: [
            $("<div>", {
                class: "template-main-head",
                html: [
                    $("<h1>", {
                        class: "",
                        html: props.title || ""
                    })
                ]
            }),
            $("<div>", {
                class: "template-main-content",
                html: props.content || ""
            })
        ]
    });
}