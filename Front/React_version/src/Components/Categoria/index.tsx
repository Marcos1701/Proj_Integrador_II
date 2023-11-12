import { useState } from 'react';
import { realizarTratamentoValor } from '../Home/Components/SecaoAcoes/Components/Saldo';
import './Categoria.css'

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

    const [showDetails, setShowDetails] = useState(false)

    const handleShowDetails = () => {
        setShowDetails(!showDetails)
    }

    const handleHideDetails = () => {
        setShowDetails(false)
    }

    return (
        <a className="categoria" id={categoria.id} onClick={handleShowDetails}>

            {showDetails && <div className="Background-blur" onMouseDown={handleHideDetails}>
                <div className="categoria-details">
                    sla
                </div>
            </div>
            }

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