import { useContext } from "react";
import "./Meta.css";
import { tratarData } from "../../../ListTransacoesCard/Components/Transacao";
import { realizarTratamentoValor } from "../../../../Home/Components/SecaoAcoes/Components/Saldo";
import { api_url, useAuth } from "../../../../../Contexts/AuthContext";
import { MetasContext } from "../../../../../Contexts/MetasContext";
import axios from "axios";

export interface IMeta {
    id: string;
    valor: number;
    valorAtual: number;
    dataLimite: Date;
    progresso: number;
    titulo: string;
    descricao?: string;
    icon: string;
    dataCriacao: Date;
    concluida: boolean;
    ativo: boolean;
}

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
        if (response.status !== 204) alert('Erro ao deletar meta');
    }

    return (
        <a className="meta-box" id={meta.id}
            onClick={() => {
                setMeta && setMeta(meta)
                setShowDetails && setShowDetails(true)
            }}
            style={{// de baixo para cima
                background: `linear-gradient(0deg, rgba(2, 177, 90, 0.15) 25%, rgba(255, 255, 255, 0) 0%)`,
            }}
        >
            <div className="value-date">
                <div className="valor">R$ {realizarTratamentoValor(meta.valor)}</div>
                <div className="data">{tratarData(meta.dataLimite.toISOString(), 'simplificado')}</div>
            </div>

            <div className="icon-text">
                <img src={`assets/icons/${meta.icon ? meta.icon : 'dollar-bill'}.svg`} alt="Icone da meta" />
                <div className="titulo-meta">{meta.titulo}</div>
            </div>
        </a>
    );
};