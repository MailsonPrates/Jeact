import CartHead from "./header-cart.js";
import { Context } from "../../src/core/jeact.js";
import HeaderSearch from "./header-search.js";

export default function Header(props={}){
 
    return $("<header>", {
        class: "border p-3 row",
        html: [
            $("<div>", {
                class: "col-md-3 border p-2 text-center",
                html: "logo"
            }),
            $("<div>", {
                class: "col-md-6",
                html: HeaderSearch
            }),
            $("<div>", {
                class: "col-md-3",
                html: $("<div>", {
                    class: "row",
                    html: [
                        $("<div>", {
                            class: "col",
                            html: CartHead({
                                quantity: Context.get("cart", "quantity")
                            })
                        })
                    ]
                })
            }),
        ]
    });
}