import './Meta.css'
export interface IMeta {
    id: string;
    valor_Desejado: number;
    valor_Atual: number;
    dataFinal: string;
    progresso: number;
    titulo?: string;
    icon?: string;
    icon_label?: string;
}

export function Meta({ meta }: { meta: IMeta }) {

    return (
        <div id={meta.id} className="meta">

            <div className="meta-icon">
                <img src={
                    meta.icon ? meta.icon : 'assets/icons/dollar-bill.svg'
                } alt={
                    meta.icon_label ? meta.icon_label : 'Icone de uma nota de dólar'
                } />
            </div>

            <div className="meta-info">
                <div className="meta-dados">
                    <h3 className='meta-title'>{meta.titulo}</h3>
                    <span className='meta-dataFinal'>{meta.dataFinal}</span>
                </div>
                <div className="meta-valores">
                    <span className='meta-valor_Atual'>{meta.valor_Atual}</span>
                    <span className='meta-valor_Desejado'>{meta.valor_Desejado}</span>
                </div>
            </div>
        </div>
    )
}