import { useState } from 'react';
import { realizarTratamentoValor } from '../../../../Home/Components/SecaoAcoes/Components/Saldo';
import './Categoria.css'
import { Navigate } from 'react-router-dom';

export interface ICategoria {
    id: string;
    nome: string;
    descricao: string;
    dataCriacao: Date;
    orcamento?: number;
    gasto: number;
    icone?: string;
}


export function Categoria({ categoria }: { categoria: ICategoria }) {

    const valorGasto: number = categoria.gasto ? categoria.gasto : 0
    const valorOrcamento: number | undefined = categoria.orcamento ? categoria.orcamento : undefined

    const [accessDetails, setAccessDetails] = useState(false)

    return (
        <a className="categoria" id={categoria.id} onClick={() => setAccessDetails(true)}>
            {accessDetails && <Navigate to={`/categorias/${categoria.id}`} />}
            <div className="categoria-icon">
                <img src={categoria.icone ? `assets/icons/${categoria.icone}.svg` : "/assets/icons/barraquinha.svg"} alt={categoria.nome} className='icon' />
            </div>

            <div className="categoria-info">
                <h3>{categoria.nome}</h3>

                <div className="categoria-valores">
                    <p className="valorGasto">{valorGasto < 0 ? `R$ 0` : `R$ ${realizarTratamentoValor(valorGasto)}`
                    }</p>
                    {valorOrcamento != undefined ?
                        <p className="valorOrcamento">R$ {realizarTratamentoValor(valorOrcamento)}</p> :
                        <span className='emptyBudget'>Sem orçamento</span>
                    }
                </div>
            </div>
        </a>
    )
}