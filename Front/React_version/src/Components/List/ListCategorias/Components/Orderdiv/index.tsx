import { useContext, useEffect, useRef } from "react";
import { CategoriasOrderContext, CategoriasOrderContextData } from "../../../../../Contexts/CategoriasContext";
import { ordenarCategorias, OrderElements } from "../../../../../providers/CategoriasProvider";
import './order.css'

export const Orderdiv = () => {

    const { order, orderby } = useContext<CategoriasOrderContextData>(CategoriasOrderContext);

    const { ordem, setOrdem } = order;
    const { ordenarPor, setOrdenarPor } = orderby;

    const SelectOrdenarPor = useRef<HTMLSelectElement>(null);

    useEffect(() => {
        if (SelectOrdenarPor.current) {
            SelectOrdenarPor.current.value = ordenarPor;
        }
    }, [ordenarPor, ordem])

    const handleOrder = () => {
        setOrdem(ordem === OrderElements.ASC ? OrderElements.DESC : OrderElements.ASC);
    }

    const handleOrderby = () => {
        if (SelectOrdenarPor.current && SelectOrdenarPor.current.value !== ordenarPor) {
            setOrdenarPor(SelectOrdenarPor.current.value as ordenarCategorias);
        }
    }


    return (<div className="order-element">

        <label htmlFor="orderby" className="order-label">Ordenar por</label>

        <select name="orderby" id="orderby" ref={SelectOrdenarPor} defaultValue='datacriacao' onChange={() => { handleOrderby(); }} title="Ordenar por">
            <option value='' disabled>Ordenar por</option>
            <option value="datacriacao">Data de Criação</option>
            <option value="nome">Nome</option>
            <option value="descricao">Descrição</option>
            <option value="orcamento">Orçamento</option>
            <option value="gasto">Gasto</option>
        </select>

        <a className="order-button" onClick={() => {
            handleOrder();
        }}>
            <img className="order-icon" src={`assets/ActionsIcons/sort${ordem === OrderElements.ASC ? '-ascending' : '-descending'}.svg`} alt="Icone de ordenação" title={ordem === OrderElements.ASC ? 'crescente' : 'decrescente'} />
        </a>
    </div>
    )
}