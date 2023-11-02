
export interface IMeta {
    id: string;
    id_usuario: string;
    valor_Desejado: number;
    valor_Atual: number;
    dataFinal: string;
    progresso: number;
    descricao: string;
    icon?: string;
    icon_descricao?: string;
}

export function Meta({ meta }: { meta: IMeta }) {

    return (
        <div id={meta.id} className="meta">
            {meta.icon &&
                <div className="meta-icon">
                    <img src={meta.icon} alt={meta.icon_descricao} />
                </div>
            }
            <div className="meta-info"
            >
                <h3>{meta.descricao}</h3>
                <span>{meta.dataFinal}</span>
            </div>
            <div className="meta-valor">
                <span>{meta.valor_Atual}</span>
                <span>{meta.valor_Desejado}</span>
            </div>
        </div>
    )
}