import Template from "../components/template/index.js";

export default function PedidoDetalhes(props={}){

    console.log("[Pedido Detalhes]", props);

    return Template({
        title: `Pedido #${props.param.id} detalhes`
    });
}