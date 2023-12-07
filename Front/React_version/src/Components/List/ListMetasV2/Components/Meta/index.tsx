import "./Meta.css";
import { tratarData } from "../../../ListTransacoesCard/Components/Transacao";
import { realizarTratamentoValor } from "../../../../Home/Components/SecaoAcoes/Components/Saldo";
import { useAuth } from "../../../../../Contexts/AuthContext";

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

    return (
        <a className="meta-box" id={meta.id}
            onClick={() => {
                setMeta && setMeta(meta)
                setShowDetails && setShowDetails(true)
            }}
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
        </a>
    );
};