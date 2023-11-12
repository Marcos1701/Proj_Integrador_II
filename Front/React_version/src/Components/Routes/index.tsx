import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoute";
import { Home } from "../Home";
import { LoginPage } from "../Auth/LoginPage";
import { RegisterPage } from "../Auth/RegisterPage";
import { TransacoesPage } from "../TransacoesPage";
import { CategoriasPage } from "../CategoriasPage";
import { DetailCategoriaPage } from "../DetailCategoriaPage";

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

            <Route path="/Categorias">
                <Route index path="/" element={
                    <ProtectedRoute>
                        <CategoriasPage />
                    </ProtectedRoute>
                } />
                {/* <Route path=":id" element={
                    <ProtectedRoute>
                        <DetailCategoriaPage return="/" />
                    </ProtectedRoute>
                } /> */}
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}