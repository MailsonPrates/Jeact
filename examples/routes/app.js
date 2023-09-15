import {State} from "../../src/core/jeact.js";

export default function App(){

    const state = State({
    });

    const Page = () => $("<div>", {
        class: "page pages-",
        html: [
            "page"
        ]
    });
    
    return state.render(Page);
}

