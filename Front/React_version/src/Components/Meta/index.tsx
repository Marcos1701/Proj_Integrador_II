import { tratarData } from '../Transacao';
import './Meta.css'
export interface IMeta {
    id: string;
    valor_Desejado: number;
    valor_Atual: number;
    dataFinal: Date;
    progresso: number;
    titulo: string;
    descricao?: string;
    icon: string;
}

export function Meta({ meta }: { meta: IMeta }) {

    return (
        <div id={meta.id} className="meta">

            <div className="meta-icon">
                <img src={
                    meta.icon ? meta.icon : 'assets/icons/dollar-bill.svg'
                } alt={meta.icon ? meta.icon : 'dollar-bill'} className='icon' />
            </div>

            <div className="meta-info">
                <div className="meta-dados">
                    <h3 className='meta-title'>{meta.titulo}</h3>
                    <span className='meta-dataFinal'>{tratarData(meta.dataFinal.toISOString())}</span>
                </div>
                <div className="meta-valores">
                    <span className='meta-valor_Atual'>{meta.valor_Atual}</span>
                    <span className='meta-valor_Desejado'>{meta.valor_Desejado}</span>
                </div>
            </div>
        </div>
    )
}