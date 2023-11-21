import { useContext, useEffect, useRef } from "react";
import { OrderElements } from "../../../../../providers/CategoriasProvider";
import { IMetaContext, MetasContext, ordenarMetas } from "../../../../../Contexts/MetasContext";

export const Orderdiv = () => {

    const { ordem, setOrdem, ordenarPor, setOrdenarPor } = useContext<IMetaContext>(MetasContext);

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
            setOrdenarPor(SelectOrdenarPor.current.value as ordenarMetas);
        }
    }


    return (<div className="order-element">

        <label htmlFor="orderby" className="order-label">Ordenar por</label>

        <select name="orderby" id="orderby" ref={SelectOrdenarPor} defaultValue='datacriacao' onChange={() => { handleOrderby(); }}>
            <option value='' disabled>Ordenar por</option>
            <option value="dataCriacao">Data de Criação</option>
            <option value="titulo">Titulo</option>
            <option value="dataLimite">Data Limite</option>
            <option value="progresso">Progresso</option>
            <option value="valor">Valor</option>
        </select>
        <a className="order-button" onClick={() => {
            handleOrder();
        }}>
            <img className="order-icon" src={`assets/ActionsIcons/sort${ordem === OrderElements.ASC ? '-ascending' : '-descending'}.svg`} alt="Icone de ordenação" title={ordem === OrderElements.ASC ? 'crescente' : 'decrescente'} />
        </a>
    </div>
    )
}