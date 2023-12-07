import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoute";
import { Home } from "../Home";
import { TransacoesPage } from "../Pages/TransacoesPage";
import { CategoriasPage } from "../Pages/CategoriasPage";
import { NotFoundPage } from "../Pages/NotFoundPage";
import { MetasPage } from "../Pages/MetasPage";
import { AddTransacaoPage } from "../Home/Components/AddItemPage/Transacao";
import { AddCategoriaPage } from "../Home/Components/AddItemPage/Categoria";
import { AddMetaPage } from "../Home/Components/AddItemPage/Meta";
import { PerfilPage } from "../Pages/Perfil";

export function PatchRoutes() {
    return (
        <Routes>
            <Route path="/" element={
                <ProtectedRoute>
                    <Home />
                </ProtectedRoute>
            } />
            <Route path="transacoes" >
                <Route path="" element={ // rota relativa à rota pai "transacoes"
                    <ProtectedRoute>
                        <TransacoesPage />
                    </ProtectedRoute>
                } />
                <Route path="add" element={ // rota relativa à rota pai "transacoes"
                    <ProtectedRoute>
                        <AddTransacaoPage />
                    </ProtectedRoute>
                } />
            </Route>
            <Route path="categorias">
                <Route path="" element={ // rota relativa à rota pai "categorias"
                    <ProtectedRoute>
                        <CategoriasPage />
                    </ProtectedRoute>
                } />
                <Route path="add" element={ // rota relativa à rota pai "categorias"
                    <ProtectedRoute>
                        <AddCategoriaPage />
                    </ProtectedRoute>
                } />
            </Route>
            <Route path="metas" >
                <Route path="" element={ // rota relativa à rota pai "metas"
                    <ProtectedRoute>
                        <MetasPage />
                    </ProtectedRoute>
                } />

                <Route path="add" element={ // rota relativa à rota pai "metas"
                    <ProtectedRoute>
                        <AddMetaPage />
                    </ProtectedRoute>
                } />

            </Route>

            <Route path="perfil" element={
                <ProtectedRoute>
                    <PerfilPage />
                </ProtectedRoute>
            } />

            <Route path="login" element={ // rota absoluta, pois não está aninhada
                <Navigate to={'/'} />
            } />
            <Route path="signup" element={ // rota absoluta, pois não está aninhada
                <Navigate to={'/'} />
            } />
            <Route path="*" element={ // rota absoluta, pois não está aninhada
                <NotFoundPage />
            } />
        </Routes>
    )
}