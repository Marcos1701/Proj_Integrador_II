import "./Meta.css";
import { tratarData } from "../../../ListTransacoesCard/Components/Transacao";
import { realizarTratamentoValor } from "../../../../Home/Components/SecaoAcoes/Components/Saldo";
import { useAuth } from "../../../../../Contexts/AuthContext";
import { Link } from "react-router-dom";

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
}

export const MetaBox = (
    {
        meta
    }: IMetaBoxProps
): JSX.Element => {

    const { user } = useAuth()

    if (!user) return (<></>)

    return (
        <Link className="meta-box" id={meta.id}
            to={`/metas/${meta.id}`}
            style={{// de baixo para cima
                background: `linear-gradient(0deg, rgba(2, 177, 90, 0.15) ${meta.progresso}%, rgba(255, 255, 255, 0) ${100 - meta.progresso}%)`
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
        </Link>
    );
};