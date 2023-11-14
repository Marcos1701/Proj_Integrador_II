import React from "react";
import "./box.css";
import { ITransacao, tratarData } from "../../ListTransacoesCard/Components/Transacao";
import { ICategoria } from "../../ListCategorias/Components/Categoria";
import { realizarTratamentoValor } from "../../../Home/Components/SecaoAcoes/Components/Saldo";

export interface ITransacaoboxProps {
    transacao: ITransacao;
    categoria: ICategoria;
}


export const Box = (
    {
        transacao,
        categoria
    }: ITransacaoboxProps
): JSX.Element => {
    return (
        <div className="transacao-box" id={transacao.id}>
            <div className="navbar">
                <div className="text-wrapper">{transacao.titulo}</div>
                <div className="div">{categoria.nome}</div>
                <div className="text-wrapper-2">{tratarData(transacao.data.toString(), 'simplificado')}</div>
                <div className="text-wrapper-3">R$ {realizarTratamentoValor(transacao.valor)}</div>
            </div>
            <svg id="vector" width="550" height="2" viewBox="0 0 545 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.496094 0.805695H544.239" stroke="#2844BD" strokeWidth="0.5" />
            </svg>

        </div>
    );
};