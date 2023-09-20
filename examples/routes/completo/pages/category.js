export default function Category(props={}){

    console.log("[Category]", {props});
    
    return $("<div>", {
        class: "page page-home",
        html: [
           $("<div>", {
                html: "Category - dfdfsdfsdfsdfdfdf"
           }),
           $("<p>", {
                html: "Category - dfdfsdfsdfsdfdfdf"
            }),
            $("<span>", {
                html: "Category - dfdfsdfsdfsdfdfdf"
            })
        ]
    })

}