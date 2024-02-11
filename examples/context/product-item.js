import { State } from "/src/index.js"

export default function ProductItem(props={}){

    const state = State({
        adding: false
    });

    const cartContext = State("cart");

    const requestAdd = () => {
        return new Promise(function(resolve){

            setTimeout(function(){
                resolve();
            }, 1000);

        });
    }

    const Item = ({adding}) => $("<div>", {
        "key": props.id,
        class: "col border m-1",
        html: $("<div>", {
            class: "p-3",
            html: [
                $("<h4>", {
                    class: "my-1",
                    html: props.name
                }),
                $("<div>", {
                    class: "mt-3 btn btn-primary"+(adding ? " disabled" : ""),
                    html: adding ? "Aguarde..." : "Adicionar",
                    click: async () => {
                        state.set("adding", true);
                        console.log("[Add to cart] processing...");

                        await requestAdd();

                        state.set("adding", false);
                        console.log("[Add to cart] success!");

                        cartContext.set("quantity", quantity => quantity+1);
                    }
                })
            ]
        })
    });

    return state.render(Item);
}