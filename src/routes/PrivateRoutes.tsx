import { Route, Routes, Navigate } from "react-router-dom";
import { DashboardPage } from "../pages/dashboard/Dashboard";
import { ProtectedRoute } from "./ProtectedRoutes";
import { FilesPage } from "../pages/files/Files";
import { CategoriesPage } from "../pages/categories/Categories";
import { ClientesPage } from "../pages/clientes/Clientes";
import { AnimaisPage } from "../pages/animais/Animais";
import { ProfissionaisPage } from "../pages/profissionais/Profissionais";
import { ServicosPage } from "../pages/servicos/Servicos";
import { AgendamentosPage } from "../pages/agendamentos/Agendamentos";
import { RelatoriosPage } from "../pages/relatorios/Relatorios";
import { Layout } from "../components/Layout";

const ROLES: ("admin" | "user")[] = ["admin", "user"];

export function PrivateRoutes() {
    return (
        <Layout>
            <Routes>
                <Route
                    path="/dashboard"
                    element={<ProtectedRoute allowedRoles={ROLES}><DashboardPage /></ProtectedRoute>}
                />
                <Route
                    path="/categories"
                    element={<ProtectedRoute allowedRoles={ROLES}><CategoriesPage /></ProtectedRoute>}
                />
                <Route
                    path="/files"
                    element={<ProtectedRoute allowedRoles={ROLES}><FilesPage /></ProtectedRoute>}
                />
                <Route
                    path="/clientes"
                    element={<ProtectedRoute allowedRoles={ROLES}><ClientesPage /></ProtectedRoute>}
                />
                <Route
                    path="/animais"
                    element={<ProtectedRoute allowedRoles={ROLES}><AnimaisPage /></ProtectedRoute>}
                />
                <Route
                    path="/profissionais"
                    element={<ProtectedRoute allowedRoles={ROLES}><ProfissionaisPage /></ProtectedRoute>}
                />
                <Route
                    path="/servicos"
                    element={<ProtectedRoute allowedRoles={ROLES}><ServicosPage /></ProtectedRoute>}
                />
                <Route
                    path="/agendamentos"
                    element={<ProtectedRoute allowedRoles={ROLES}><AgendamentosPage /></ProtectedRoute>}
                />
                <Route
                    path="/relatorios"
                    element={<ProtectedRoute allowedRoles={ROLES}><RelatoriosPage /></ProtectedRoute>}
                />

                <Route path="/*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </Layout>
    );
}
