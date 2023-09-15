import { State, Context } from "../../src/core/jeact.js"

export default function ProductItem(props={}){

    const state = State({
        adding: false
    });

    const requestAdd = () => {
        return new Promise(function(resolve){

            setTimeout(function(){
                resolve();
            }, 1000);

        });
    }

    const Item = () => $("<div>", {
        "data-id": props.id,
        class: "col border m-1",
        html: $("<div>", {
            class: "p-3",
            html: [
                $("<h4>", {
                    class: "my-1",
                    html: props.name
                }),
                $("<div>", {
                    class: "mt-3 btn btn-primary"+(state.adding ? " disabled" : ""),
                    html: state.adding ? "Aguarde..." : "Adicionar",
                    click: async () => {
                        state.set("adding", true);
                        console.log("[Add to cart] processing...");

                        await requestAdd();

                        state.set("adding", false);
                        console.log("[Add to cart] success!");

                        const contextState = Context.get("cart");
                        const quantity = contextState.quantity + 1;

                        contextState.set("quantity", quantity);
                    }
                })
            ]
        })
    });

    return state.render(Item);
}