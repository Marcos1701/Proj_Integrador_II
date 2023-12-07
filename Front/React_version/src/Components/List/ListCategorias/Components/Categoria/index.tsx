import { useContext } from 'react';
import { realizarTratamentoValor } from '../../../../Home/Components/SecaoAcoes/Components/Saldo';
import './Categoria.css'
import { api_url, useAuth } from '../../../../../Contexts/AuthContext';
import { CategoriasOrderContext } from '../../../../../Contexts/CategoriasContext';
import axios from 'axios';
import { tratarData } from '../../../ListTransacoesCard/Components/Transacao';

export interface ICategoria {
    id: string;
    nome: string;
    descricao: string;
    dataCriacao: Date;
    orcamento?: number;
    gasto: number;
    icone?: string;
}

export interface ICategoriaProps {
    categoria: ICategoria;
    setShowDetails?: React.Dispatch<React.SetStateAction<boolean>>;
    setCategoria?: React.Dispatch<React.SetStateAction<ICategoria | undefined>>;
}


export function Categoria({ categoria, setShowDetails, setCategoria }: ICategoriaProps) {

    const { user } = useAuth()

    if (!user) return (<></>)

    const { setUpdated } = useContext(CategoriasOrderContext)

    const HandleDelete = async () => {
        const response = await axios.delete(`${api_url}categorias/${categoria.id}`, {
            headers: {
                Authorization: user.access_token
            }
        }).catch((error) => {
            console.log(error)
            return error
        })

        if (response && response.status === 200) {
            setUpdated && setUpdated(true)
        }
    }

    const valorGasto: number = categoria.gasto ? categoria.gasto : 0
    const valorOrcamento: number | undefined = categoria.orcamento ? categoria.orcamento : undefined


    return (
        <a className="categoria-box" id={categoria.id} onClick={() => {
            setCategoria && setCategoria(categoria)
            setShowDetails && setShowDetails(true)
        }}>
            <div className="item">

                <div className='navbar'>
                    <div className="title-icon">
                        <div className="icon-div"><img className="icon-Categoria" src={`assets/icons/${categoria.icone ? categoria.icone : 'barraquinha'}.svg`} alt="Icone da categoria" /></div>
                        {categoria.nome}
                    </div>
                    <div className="dataCriacao">{tratarData(categoria.dataCriacao.toString(), 'simplificado')}</div>
                    <div className="gastoCategoria" >R$ {realizarTratamentoValor(valorGasto)}</div>
                    <div className={"orcamento" + (valorOrcamento ? "-true" : "-false")} >{
                        valorOrcamento ?
                            `R$ ${realizarTratamentoValor(valorOrcamento)}`
                            :
                            '-'
                    }</div>
                </div>
                <button className="ButtonDelete" onClick={HandleDelete}><img className='icon' src="assets/ActionsIcons/delete.svg" alt="Deletar" /></button>
            </div>
            <svg id="vector" width="530" height="2" viewBox="0 0 545 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.496094 0.805695H544.239" stroke="#47B5FF" strokeWidth="0.5" />
            </svg>
        </a>
    )
}
