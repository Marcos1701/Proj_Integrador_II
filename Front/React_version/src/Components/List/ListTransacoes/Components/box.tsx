import { useContext, useState } from "react";
import "./box.css";
import { ITransacao, tratarData } from "../../ListTransacoesCard/Components/Transacao";
import { ICategoria } from "../../ListCategorias/Components/Categoria";
import { realizarTratamentoValor } from "../../../Home/Components/SecaoAcoes/Components/Saldo";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { api_url, useAuth } from "../../../../Contexts/AuthContext";
import { TransacoesContext } from "../../../../Contexts/TransacoesContext";

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

    const { user } = useAuth()

    if (!user) return (<></>)

    const { setUpdated } = useContext(TransacoesContext)

    const HandleDelete = async () => {
        const response = await axios.delete(`${api_url}transacoes/${transacao.id}`, {
            headers: {
                Authorization: user.access_token
            }
        }).then((response) => {
            if (response.status === 204) {
                setUpdated(true)
            }
            return response
        })
        console.log(response)
    }

    const [showDetails, setShowDetails] = useState(false);

    return (
        <div className="transacao-box" id={transacao.id}>
            {showDetails && (<Navigate to={`/transacoes/${transacao.id}`} />)}
            <div className="item">
                <a className="navbar" onClick={() => setShowDetails(!showDetails)}>
                    <div className="title-icon">
                        <div className="icon-div"><img className="icon-Categoria" src={`assets/icons/${categoria.icone ? categoria.icone : 'barraquinha'}.svg`} alt="Icone da categoria" /></div>
                        {transacao.titulo}
                    </div>
                    <div className="div">{categoria.nome}</div>
                    <div className="text-wrapper-2">{tratarData(transacao.data.toString(), 'simplificado')}</div>
                    <div className={
                        "valorTransacao-" + transacao.tipo
                    } >R$ {realizarTratamentoValor(transacao.valor)}</div>

                </a>
                <button className="ButtonDelete" onClick={HandleDelete}><img className='icon' src="assets/ActionsIcons/delete.svg" alt="Deletar" /></button>
            </div>
            <svg id="vector" width="530" height="2" viewBox="0 0 545 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.496094 0.805695H544.239" stroke="#2844BD" strokeWidth="0.5" />
            </svg>

        </div>
    );
};