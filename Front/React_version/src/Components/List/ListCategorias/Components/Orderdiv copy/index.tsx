import { useContext, useEffect, useRef } from "react";
import { CategoriasOrderContext, CategoriasOrderContextData } from "../../../../../Contexts/CategoriasContext";
import { ordenarCategorias, OrderElements } from "../../../../../providers/CategoriasProvider";

export const Orderdiv = () => {

    const { order, orderby } = useContext<CategoriasOrderContextData>(CategoriasOrderContext);

    const { ordem, setOrdem } = order;
    const { ordenarPor, setOrdenarPor } = orderby;


    const SelectOrdem = useRef<HTMLSelectElement>(null);
    const SelectOrdenarPor = useRef<HTMLSelectElement>(null);

    useEffect(() => {
        if (SelectOrdenarPor.current && SelectOrdem.current) {
            SelectOrdenarPor.current.value = ordenarPor;
            SelectOrdem.current.value = ordem;
        }
    }, [ordenarPor, ordem])

    const handleOrder = () => {
        if (SelectOrdem.current && SelectOrdem.current.value !== ordem) {
            setOrdem(SelectOrdem.current.value as OrderElements);
        }
    }

    const handleOrderby = () => {
        if (SelectOrdenarPor.current && SelectOrdenarPor.current.value !== ordenarPor) {
            setOrdenarPor(SelectOrdenarPor.current.value as ordenarCategorias);
        }
    }


    return (<div className="filter">

        <select name="filter" id="filter" ref={SelectOrdenarPor} defaultValue='datacriacao' onChange={() => { handleOrderby(); }}>
            <option value='' disabled>Ordenar por</option>
            <option value="datacriacao">Data de Criação</option>
            <option value="nome">Nome</option>
            <option value="descricao">Descrição</option>
            <option value="orcamento">Orçamento</option>
            <option value="gasto">Gasto</option>
        </select>
        <select name="order" id="order" ref={SelectOrdem} defaultValue='ASC' onChange={() => { handleOrder(); }}>
            <option value='' disabled>Ordem</option>
            <option value="ASC" selected>Crescente</option>
            <option value="DESC">Decrescente</option>
        </select>
    </div>
    )
}