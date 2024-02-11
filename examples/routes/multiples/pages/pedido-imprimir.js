import Template from "../components/template/index.js";

export default function PedidoImprimir(props={}){

    console.log("[Pedido Imprimir]", props);

    return Template({
        title: `Pedido #${props.param.id} imprimir`
    });
}