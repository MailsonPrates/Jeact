import Template from "../components/template/index.js";

export default function PedidoFilter(props={}){
    console.log("[Pedidos Filter]", props);

    return Template({
        title: "Pedidos Filtro"
    });
}