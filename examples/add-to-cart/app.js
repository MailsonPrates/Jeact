import {State} from "../../src/core/jeact.js";
import ProductList from "./product-list.js";
import Header from "./header.js";

export default function App(){

    const state = State({
        quantity: 1
    }, "cart");

    const Page = () => $("<div>", {
        class: "mt-3",
        html: [
            $("<h2>", {html: "Nested Components"}),
            Header(),
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

