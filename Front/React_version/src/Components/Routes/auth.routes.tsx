import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../Auth/LoginPage";
import { RegisterPage } from "../Auth/RegisterPage";

export function AuthRoutes(): JSX.Element {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<RegisterPage />} />
        </Routes>
    )
}