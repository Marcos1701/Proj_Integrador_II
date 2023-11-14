import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoute";
import { Home } from "../Home";
import { LoginPage } from "../Auth/LoginPage";
import { RegisterPage } from "../Auth/RegisterPage";
import { TransacoesPage } from "../Pages/TransacoesPage";
import { CategoriasPage } from "../Pages/CategoriasPage";
import { DetailCategoriaPage } from "../Pages/DetailsPage/Categoria";
import { NotFoundPage } from "../Pages/NotFoundPage";
import { DetailsTransacaoPage } from "../Pages/DetailsPage/Transacao";
import { DetailsMetaPage } from "../Pages/DetailsPage/Meta";
import { MetasPage } from "../Pages/MetasPage";

export function PatchRoutes() {
    return (
        <Routes>
            <Route path="/" element={
                <ProtectedRoute>
                    <Home />
                </ProtectedRoute>
            } />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/transacoes">
                <Route index element={
                    <ProtectedRoute>
                        <TransacoesPage />
                    </ProtectedRoute>
                } />
                <Route path=":id" element={
                    <ProtectedRoute>
                        <DetailsTransacaoPage return="/" />
                    </ProtectedRoute>
                } />
            </Route>
            <Route path="/categorias">
                <Route index element={
                    <ProtectedRoute>
                        <CategoriasPage />
                    </ProtectedRoute>
                } />
                <Route path=":id" element={
                    <ProtectedRoute>
                        <DetailCategoriaPage return="/" />
                    </ProtectedRoute>
                } />
            </Route>
            <Route path="/metas">
                <Route index element={
                    <ProtectedRoute>
                        <MetasPage />
                    </ProtectedRoute>
                } />
                <Route path=":id" element={
                    <ProtectedRoute>
                        <DetailsMetaPage return="/" />
                    </ProtectedRoute>
                } />
            </Route>
            <Route path="*" element={
                <NotFoundPage />
            } />
        </Routes>
    )
}