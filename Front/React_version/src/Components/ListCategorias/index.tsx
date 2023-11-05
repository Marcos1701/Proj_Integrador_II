import { Categoria, ICategoria } from "../Categoria";
import { useContext, useEffect, useState } from "react";
import { CategoriasContext } from "../../Contexts/CategoriasContext";
import { ITransacao } from "../Transacao";
import { TransacoesContext } from "../../Contexts/TransacoesContext";


interface ListCategoriasProps {
    pagination?: boolean
    filter?: boolean
    search?: boolean
    limit?: number
    order?: string
    orderBy?: string
    page?: number
}

export function ListCategorias(
    {
        pagination = false,
        filter = false,
        search = false,
        limit = 2,
        order = 'ASC',
        orderBy = 'data',
        page = 1
    }: ListCategoriasProps
) {
    // const categorias = await fetch(`http://localhost:3000/Categoria`,
    //     {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ id_usuario: user!.id })
    //     }
    // ).then(res => res.json()).catch(err => {
    //     console.log(err)
    //     return []
    // })

    const [pageAtual, setPageAtual] = useState<number>(page);

    const transacoes: ITransacao[] = useContext<ITransacao[]>(TransacoesContext);
    const categorias: ICategoria[] = useContext<ICategoria[]>(CategoriasContext).map((categoria: ICategoria) => {
        const transacoesCategoria: ITransacao[] = transacoes.filter((transacao: ITransacao) => {
            return transacao.id_categoria === categoria.id
        })
        const gasto: number = transacoesCategoria.reduce((acc: number, transacao: ITransacao) => {
            return acc + transacao.valor
        }, 0)
        return {
            ...categoria,
            gasto
        }
    })

    const [searchValue, setSearchValue] = useState<string>('');
    const [filtrosbase, setFiltros] = useState<{ order: string, orderBy: string }>({ order, orderBy })

    const filtros = {
        order: ['ASC', 'DESC'].includes(order) ? filtrosbase.order : 'ASC',
        orderBy: ['nome', 'Orçamento', 'Gasto'].includes(orderBy) ? filtrosbase.orderBy : 'data'
    }

    const orderCategorias = (categorias: ICategoria[]) => {
        const categoriasOrdenadas = categorias.sort((a: ICategoria, b: ICategoria) => {
            if (filtros.orderBy === 'nome') {
                if (filtros.order === 'ASC') {
                    return a.nome.localeCompare(b.nome)
                }
                return b.nome.localeCompare(a.nome)
            }
            if (filtros.orderBy === 'Orçamento') {
                if (!a.orcamento || !b.orcamento) return 0

                if (filtros.order === 'ASC') {
                    return a.orcamento.limite - b.orcamento.limite
                }
                return b.orcamento.limite - a.orcamento.limite
            }
            if (filtros.orderBy === 'Gasto') {
                if (filtros.order === 'ASC') {
                    return a.gasto - b.gasto
                }
                return b.gasto - a.gasto
            }
            return 0
        })
        return categoriasOrdenadas
    }

    const [categoriasOrdenadas, setCategoriasOrdenadas] = useState<ICategoria[]>(categorias)

    useEffect(() => {
        const categoriasOrdenadas = orderCategorias(categorias)
        setCategoriasOrdenadas(categoriasOrdenadas)
    }, [])

    return (
        <>
            <div className="lista-categorias">

                {search || filter && (
                    <div className="search-filter">
                        {search && <input type="text" placeholder="Pesquisar" />}
                        {filter && <button> <i className="fas fa-search"></i> </button>}
                    </div>
                )}

                <ul className="list-values-2columns">
                    {
                        categoriasOrdenadas.slice(page * limit - limit, page * limit)
                            .map(
                                (categoria: ICategoria) => <li key={categoria.id}><Categoria categoria={categoria} key={categoria.id} /> </li>
                            )
                    }
                </ul>
                {
                    pagination && <div className="pagination">
                        <button onClick={() => {
                            if (pageAtual > 1) {
                                setPageAtual(pageAtual - 1);
                            }
                        }}>Anterior</button>
                        <button>{pageAtual}</button>
                        {pageAtual < Math.ceil(categorias.length / limit) && <button>{pageAtual + 1}</button>}
                        {pageAtual + 1 < Math.ceil(categorias.length / limit) && <button>{pageAtual + 2}</button>}
                        <p className="dots">...</p>
                        {pageAtual < Math.ceil(categorias.length / limit) && <button>{Math.ceil(categorias.length / limit)}</button>}
                        <button onClick={() => {
                            if (pageAtual < Math.ceil(categorias.length / limit)) {
                                setPageAtual(pageAtual + 1);
                            }
                        }}>Próximo</button>
                    </div>
                }
            </div>
        </>
    )

}

// o codigo acima possui um erro, ele esta na linha 121, pois o botão de proximo esta aparecendo mesmo quando não tem mais paginas,