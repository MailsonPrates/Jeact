import Template from "../components/template/index.js";

export default function PedidoLista(props={}){
    console.log("[Pedido Imprimir]", props);

    return Template({
        title: "Pedido Listar"
    });
}