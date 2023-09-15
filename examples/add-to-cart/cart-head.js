export default function CartHead(props={}){
    return $("<div>", {
        class: "p-2 border",
        html: [
            $("<span>", {text: "Cart:"}),
            $("<span>", {
                class: "ms-1",
                html: `(${props.quantity || 0})`
            })
        ]
    });
 }