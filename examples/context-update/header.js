import CartHead from "./cart-head.js";
import { Context } from "../../src/core/jeact.js";

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
                html: $("<input>", {
                    class: "form-control",
                    placeholder: "Busca..."
                })
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