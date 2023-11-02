import { CategoriasContext } from "../../Contexts/CategoriasContext";
import { TransacoesContext } from "../../Contexts/TransacoesContext";
import { ICategoria } from "../Categoria";
import { ITransacao, Transacao } from "../Transacao"
import { Suspense, useContext, useState } from "react";
import './ListTransacoes.css'


interface IListTransacoesProps {
    page?: number;
    limit?: number;
    pagination?: boolean;
}

export function ListTransacoes({ page = 1, limit = 2, pagination = true }: IListTransacoesProps) {

    const transacoes: ITransacao[] = useContext(TransacoesContext)
    const categorias: ICategoria[] = useContext(CategoriasContext)
    const [pageAtual, setPageAtual] = useState<number>(page);

    return (
        <Suspense fallback={
            <div className="transacoes-home-skeleton" >
            </div>
        }>
            <div className="list_transacoes" >
                <ul className="list-values-2columns" id="list-Transacoes">
                    {
                        transacoes
                            .slice((pageAtual - 1) * limit, pageAtual * limit)
                            .map(
                                (transacao: ITransacao) => {
                                    const categoria: ICategoria | undefined = categorias.find(
                                        (categoria: ICategoria) => {
                                            return categoria.id === transacao.id_categoria
                                        }
                                    );

                                    if (!categoria) {
                                        return <></>
                                    }

                                    return (
                                        <li key={"key" + transacao.id}>
                                            <Transacao
                                                transacao={transacao}
                                                categoria={categoria}
                                            />
                                        </li>
                                    )
                                }
                            )
                    }
                </ul>
            </div>

            {pagination && <div className="pagination">
                <button onClick={() => {
                    if (pageAtual > 1) {
                        setPageAtual(pageAtual - 1);
                    }
                }}>Anterior</button>
                <button>{pageAtual}</button>
                {pageAtual < Math.ceil(transacoes.length / limit) && <button>{pageAtual + 1}</button>}
                {pageAtual + 1 < Math.ceil(transacoes.length / limit) && <button>{pageAtual + 2}</button>}
                <p className="dots">...</p>
                {pageAtual < Math.ceil(transacoes.length / limit) && <button>{Math.ceil(transacoes.length / limit)}</button>}
                <button onClick={() => {
                    if (pageAtual < Math.ceil(transacoes.length / limit)) {
                        setPageAtual(pageAtual + 1);
                    }
                }}>Próximo</button>
            </div>
            }
        </Suspense>
    )
}

/* 
Warning: Each child in a list should have a unique "key" prop.

Check the render method of `ListTransacoes`. See https://reactjs.org/link/warning-keys for more information.
    at li
    at ListTransacoes (http://localhost:5173/src/Components/ListTransacoes/index.tsx?t=1698946356014:24:3)
    at section
    at main
    at Home
    at ProtectedRoute (http://localhost:5173/src/Components/ProtectedRoute/index.tsx?t=1698946134530:21:3)
    at RenderedRoute (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=064b4a60:3405:5)
    at Routes (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=064b4a60:3788:5)
    at PatchRoutes
    at MetasProvider (http://localhost:5173/src/providers/MetasProvider.tsx?t=1698946134530:23:3)
    at CategoriasProvider (http://localhost:5173/src/providers/CategoriasProvider.tsx?t=1698946134530:23:3)
    at TransacoesProvider (http://localhost:5173/src/providers/TransacoesProvider.tsx?t=1698946134530:23:3)
    at Router (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=064b4a60:3735:15)
    at BrowserRouter (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=064b4a60:4383:5)
    at App
    at AuthProvider (http://localhost:5173/src/Contexts/AuthContext.tsx?t=1698946134530:23:3)
eval @ VM2007:1
printWarning @ react-jsx-dev-runtime.development.js:87
error @ react-jsx-dev-runtime.development.js:61
validateExplicitKey @ react-jsx-dev-runtime.development.js:1078
validateChildKeys @ react-jsx-dev-runtime.development.js:1105
jsxWithValidation @ react-jsx-dev-runtime.development.js:1276
ListTransacoes @ index.tsx:27
renderWithHooks @ react-dom.development.js:16305
updateFunctionComponent @ react-dom.development.js:19588
beginWork @ react-dom.development.js:21601
beginWork$1 @ react-dom.development.js:27426
performUnitOfWork @ react-dom.development.js:26557
workLoopSync @ react-dom.development.js:26466
renderRootSync @ react-dom.development.js:26434
performConcurrentWorkOnRoot @ react-dom.development.js:25738
workLoop @ scheduler.development.js:266
flushWork @ scheduler.development.js:239
performWorkUntilDeadline @ scheduler.development.js:533

esse erro ocorre quando não temos uma key para cada elemento da lista, para resolver isso, basta adicionar uma key para cada elemento da lista, no caso, a key é o id da transação
da seguinte forma: <li key={transacao.id}>, mas o erro continua, pois o id não é único, para resolver isso, basta adicionar o index da transação na lista, da seguinte forma: 


*/