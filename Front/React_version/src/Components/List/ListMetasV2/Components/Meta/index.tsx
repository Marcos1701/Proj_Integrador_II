import { useContext } from "react";
import "./Meta.css";
import { IMeta } from "../../../ListMetas/Components/Meta";
import { tratarData } from "../../../ListTransacoesCard/Components/Transacao";
import { realizarTratamentoValor } from "../../../../Home/Components/SecaoAcoes/Components/Saldo";
import { api_url, useAuth } from "../../../../../Contexts/AuthContext";
import { MetasContext } from "../../../../../Contexts/MetasContext";
import axios from "axios";

interface IMetaBoxProps {
    meta: IMeta
    setShowDetails?: React.Dispatch<React.SetStateAction<boolean>>
    setMeta?: React.Dispatch<React.SetStateAction<IMeta | undefined>>
}

export const MetaBox = (
    {
        meta,
        setShowDetails,
        setMeta
    }: IMetaBoxProps
): JSX.Element => {

    const { user } = useAuth()

    if (!user) return (<></>)

    const { setUpdated } = useContext(MetasContext)

    const HandleDelete = async () => {
        const response = await axios.delete(`${api_url}meta/${meta.id}`, {
            headers: {
                Authorization: user.access_token
            }
        }).then((response) => {
            if (response.status === 204) {
                setUpdated(true)
            }
            return response
        })
        // console.log(response)
    }

    return (
        <a className="meta-box" id={meta.id}
            onClick={() => {
                setMeta && setMeta(meta)
                setShowDetails && setShowDetails(true)
            }}
            style={{ // cor do background de acordo com a porcentagem de conclusão da meta
                background: meta.progresso > 0 ? meta.progresso > 0 && meta.progresso < 100 ? `linear-gradient(90deg, #0fa06162 ${meta.progresso}%, transparent ${meta.progresso}%)` : '#2844BD' : "transparent"
            }}
            title={meta.progresso + '% concluído'}
        >
            <div className="item">

                <div className="navbar">
                    <div className="text-wrapper">{meta.titulo}</div>
                    <div className="text-wrapper-2">{tratarData(meta.dataLimite.toISOString(), 'simplificado')}</div>
                    <div className="text-wrapper-3">R$ {realizarTratamentoValor(meta.valor)}</div>
                    <div className="text-wrapper-4">R$ {realizarTratamentoValor(meta.valorAtual)}</div>
                </div>
                <button className="ButtonDelete" onClick={HandleDelete}><img className='icon' src="assets/ActionsIcons/delete.svg" alt="Deletar" /></button>
            </div>
            <svg id="vector" width="550" height="2" viewBox="0 0 545 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.496094 0.805695H544.239" stroke="#2844BD" strokeWidth="0.5" />
            </svg>

        </a>
    );
};