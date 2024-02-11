import { State } from "../../src/core/jeact.js";

export default function HeaderSearch(){

    const state = State({
        processing: false,
        term: "",
        data: []
    });

    const requestSearch = function(){
        return $.ajax({
            type: "get",
            url: "https://dummyjson.com/products",
            dataType: "json"
        });
    }

    const onSearchInputChange = function(){

        console.log({state})

        var currentTerm = $(this).val();
        var stateTerm = state.term;

        if ( currentTerm == stateTerm || state.processing ) return;

        console.log({currentTerm});

        state.set("term", currentTerm);

        if ( !currentTerm.trim() ){
            state.set("data", []);
            return;
        }

        state.set("processing", true);

        requestSearch()
            .then(function(response){
                console.log("[req]", response);
                state.set("processing", false);

                var products = response.products || [];

                if ( !products.length ){
                    state.set("data", []);
                    return;
                }

                state.set("data", products);
            });

    }

    const component = () => $("<div>", {
        class: (state.data.length ? "open" : "closed") + (state.processing ? " searching" : ""),
        html: [
            $("<div>", {
                html: $("<input>", {
                    class: "form-control",
                    placeholder: "Busca...",
                    //change: onSearchInputChange,
                    keyup: onSearchInputChange
                })
            }),
            state.data.length 
                ? $("<div>", {
                id: "result",
                class: "mt-1 border-top p-3",
                html: "produtos produtos proditus produtos<br>produtos produtos proditus produtos",
                click: function(){console.log("click produtos")}
            }) : $("<div>", {
                html: "vazio",
                id: "empty-result",
                click: function(){console.log("click vazio")}
            })
        ]
    })

    return state.render(component);
}