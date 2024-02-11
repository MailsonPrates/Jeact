import {State} from "/src/index.js";
import ProductList from "./product-list.js";
import Header from "./header.js";

/**
 * @todo refatorar geral
 */
export default function App(){

    const state = State({
        quantity: 0
    }, "cart");

    const Page = () => $("<div>", {
        class: "mt-3",
        html: [
            $("<h2>", {html: "Nested Components"}),
            Header({
                cartQuantity: state.get("quantity")
            }),
            $("<div>", {
                class: "mt-3 pb-3",
                html: [
                    ProductList
                ]
            })
        ]
    });
    
    return state.render(Page);
}

