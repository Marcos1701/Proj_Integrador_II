import { useContext, useEffect, useRef } from "react";
import { ordenarCategorias, OrderElements } from "../../../../../providers/CategoriasProvider";
import { TransacoesContext, TransacoesContextData } from "../../../../../Contexts/TransacoesContext";
import { ordenarTransacoes } from "../../../../../providers/TransacoesProvider";

export const Orderdiv = () => {

    const { ordem, setOrdem, ordenarPor, setOrdenarPor } = useContext<TransacoesContextData>(TransacoesContext);


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
            setOrdenarPor(SelectOrdenarPor.current.value as ordenarTransacoes);
        }
    }


    return (<div className="filter">

        <select name="filter" id="filter" ref={SelectOrdenarPor} defaultValue='datacriacao' onChange={() => { handleOrderby(); }}>
            <option value='' disabled>Ordenar por</option>
            <option value="data">Data da Transação</option>
            <option value="titulo">Titulo</option>
            <option value="descricao">Descrição</option>
            <option value="valor">Valor</option>
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
        </select>
        <select name="order" id="order" ref={SelectOrdem} defaultValue='ASC' onChange={() => { handleOrder(); }}>
            <option value='' disabled>Ordem</option>
            <option value="ASC" selected>Crescente</option>
            <option value="DESC">Decrescente</option>
        </select>
    </div>
    )
}