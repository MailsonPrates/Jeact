export default function Placeholder(){
    return $("<div>", {
        class: "placeholder-glow",
        html: [
            $("<span>", {class: "placeholder col-6"}),
            $("<span>", {class: "placeholder col-6"}),
            $("<span>", {class: "placeholder col-8"}),
            $("<span>", {class: "placeholder col-4"})
        ]
    })
}