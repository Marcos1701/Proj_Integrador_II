import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoute";
import { Home } from "../Home";
import { LoginPage } from "../Auth/LoginPage";
import { RegisterPage } from "../Auth/RegisterPage";
import { TransacoesPage } from "../TransacoesPage";

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
            <Route path="/Transacoes" element={
                <ProtectedRoute>
                    <TransacoesPage />
                </ProtectedRoute>
            } />

            <Route path="/Categorias" element={
                <ProtectedRoute>
                    <h1>Categorias</h1>
                </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}