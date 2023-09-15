import ProductItem from "./product-item.js";

export default function ProductList(){
    
    var productsData = [
        {"id": "001", "name": "Produto numero 1"},
        {"id": "002", "name": "Produto numero 2"},
        {"id": "003", "name": "Produto numero 3"},
        {"id": "004", "name": "Produto numero 4"}
    ];

    var productsElements = [];

    productsData.forEach(function(product){
        productsElements.push(ProductItem(product));
    });
    
    return $("<div>", {
        class: "p-3",
        html: [
            $("<h2>", {
                class: "mt-3",
                html: "Produtos"
            }),
            $("<div>", {
                class: "row",
                html: productsElements
            })
        ]
    });
}