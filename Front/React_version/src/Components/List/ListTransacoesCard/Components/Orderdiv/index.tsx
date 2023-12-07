import { useContext, useEffect, useRef } from "react";
import { OrderElements } from "../../../../../providers/CategoriasProvider";
import { TransacoesContext, TransacoesContextData, SortFieldTransacao } from "../../../../../Contexts/TransacoesContext";

export const Orderdiv = () => {

    const { ordem, setOrdem, ordenarPor, setOrdenarPor } = useContext<TransacoesContextData>(TransacoesContext);

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
            setOrdenarPor(SelectOrdenarPor.current.value as SortFieldTransacao);
        }
    }


    return (<div className="order-element">

        <label htmlFor="orderby" className="order-label">Ordenar por</label>

        <select name="orderby" id="orderby" ref={SelectOrdenarPor} defaultValue='datacriacao' onChange={() => { handleOrderby(); }}>
            <option value='' disabled>Ordenar por</option>
            <option value="data">Data da Transação</option>
            <option value="titulo">Titulo</option>
            <option value="descricao">Descrição</option>
            <option value="valor">Valor</option>
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
        </select>
        <a className="order-button" onClick={() => {
            handleOrder();
        }}>
            <img className="order-icon" src={`assets/ActionsIcons/sort${ordem === OrderElements.ASC ? '-ascending' : '-descending'}.svg`} alt="Icone de ordenação" title={ordem === OrderElements.ASC ? 'crescente' : 'decrescente'} />
        </a>
    </div>
    )
}