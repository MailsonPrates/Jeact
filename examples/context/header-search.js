import { State } from "/src/index.js";

export default function HeaderSearch(){

    const state = State({
        processing: false,
        term: "",
        data: []
    });

    const Core = {

        onSearchInputChange: function(){

            var currentTerm = $(this).val();
            var {term, processing} = state.get();
    
            if ( currentTerm == term || processing ) return;
    
            console.log({currentTerm});
    
            state.set("term", currentTerm);
    
            if ( !currentTerm.trim() ){
                state.set("data", []);
                return;
            }
    
            state.set("processing", true);
    
            Core.requestSearch()
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
    
        },

        requestSearch: () => $.ajax({
            type: "get",
            url: "https://dummyjson.com/products",
            dataType: "json"
        })
    }

    const Ui = {

        result: () => $.div({
            id: "result",
            class: "mt-1 border-top p-3",
            html: "produtos produtos proditus produtos<br>produtos produtos proditus produtos",
            click: function(){console.log("click produtos")}
        }),

        empty: () => $.div({
            html: "vazio",
            id: "empty-result",
            click: function(){console.log("click vazio")}
        })
    }


    return state.render( ({processing, data}) => $.div({
        class: (data.length 
                ? "open" 
                : "closed") 
                + (processing ? " searching" : ""),
        html: [
            $.div({
                html: $("<input>", {
                    class: "form-control",
                    placeholder: "Busca...",
                    //change: onSearchInputChange,
                    keyup: Core.onSearchInputChange
                })
            }),
            $.div({
                conditional: data.length
                    ? Ui.result()
                    : Ui.empty()
            })
        ]
    }));
}