import JeactDOM from "./jeact-dom";

export default function Jeact(config={}){

    let dom = JeactDOM();
    
    if ( config.elements ) dom.setElements(config.elements);
}