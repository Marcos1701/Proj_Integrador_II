import { useContext, useEffect, useRef, useState } from "react";
import { CategoriasOrderContext, CategoriasOrderContextData } from "../../../../Contexts/CategoriasContext";
import { ordenarCategorias } from "../../../../providers/CategoriasProvider";

export const Orderdiv = () => {

    const { order } = useContext<CategoriasOrderContextData>(CategoriasOrderContext);

    const { setOrder } = order;

    const filtro = useRef<HTMLSelectElement>(null);
    const ordem = useRef<HTMLSelectElement>(null);

    const [orderState, setOrderState] = useState<ordenarCategorias>({});

    useEffect(() => {
        setOrder(orderState);
    }, [orderState])

    useEffect(() => {
        const filtroAtual = filtro.current ? filtro.current.value : 'dataCriacao';
        const ordemAtual = ordem.current ? ordem.current.value : 'ASC';

        setOrderState({ ...orderState, [filtroAtual]: ordemAtual })
    }, [filtro.current?.value, ordem.current?.value])


    return (<div className="filter">

        <select name="filter" id="filter" ref={filtro}>
            <option value="dataCriacao" selected>Data de Criação</option>
            <option value="nome">Nome</option>
            <option value="orcamento">Orçamento</option>
        </select>
        <select name="order" id="order" ref={ordem}>
            <option value="ASC" selected>Crescente</option>
            <option value="DESC">Decrescente</option>
        </select>
    </div>
    )
}