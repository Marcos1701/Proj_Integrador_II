import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoute";
import { Home } from "../Home";
import { LoginPage } from "../Auth/LoginPage";
import { RegisterPage } from "../Auth/RegisterPage";
import { TransacoesPage } from "../Pages/TransacoesPage";
import { CategoriasPage } from "../Pages/CategoriasPage";
import { NotFoundPage } from "../Pages/NotFoundPage";
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
            <Route path="/transacoes" element={
                <ProtectedRoute>
                    <TransacoesPage />
                </ProtectedRoute>
            } />
            <Route path="/categorias" element={
                <ProtectedRoute>
                    <CategoriasPage />
                </ProtectedRoute>
            } />
            <Route path="/metas" element={
                <ProtectedRoute>
                    <MetasPage />
                </ProtectedRoute>
            } />
            <Route path="*" element={
                <NotFoundPage />
            } />
        </Routes>
    )
}
