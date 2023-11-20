import { useState } from 'react';
import { tratarData } from '../../../ListTransacoesCard/Components/Transacao';
import './Meta.css'
import { Navigate } from 'react-router-dom';
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

export function Meta({ meta }: { meta: IMeta }) {

    const [accessDetails, setAccessDetails] = useState(false)

    return (
        <a id={meta.id} className="meta" onClick={() => setAccessDetails(true)}>
            {accessDetails && <Navigate to={`/metas/${meta.id}`} />}
            <div className="meta-icon">
                <img src={
                    meta.icon ? `assets/icons/${meta.icon}` : 'assets/icons/dollar-bill.svg'
                } alt={meta.icon ? meta.icon : 'dollar-bill'} className='icon' />
            </div>

            <div className="meta-info">
                <div className="meta-dados">
                    <h3 className='meta-title'>{meta.titulo}</h3>
                    <span className='meta-dataFinal'>{tratarData(meta.dataLimite.toISOString())}</span>
                </div>
                <div className="meta-valores">
                    <span className='meta-valor_Atual'>{meta.valorAtual}</span>
                    <span className='meta-valor_Desejado'>{meta.valor}</span>
                </div>
            </div>
        </a>
    )
}