import { Route, Routes, Navigate } from "react-router-dom";
import { DashboardPage } from "../pages/dashboard/Dashboard";
import { ProtectedRoute } from "./ProtectedRoutes";
import { FilesPage } from "../pages/files/Files";
import { CategoriesPage } from "../pages/categories/Categories";

export function PrivateRoutes() {
    return (
        <Routes>
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute
                        allowedRoles={["admin", "user"]}
                    >
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/files"
                element={
                    <ProtectedRoute
                        allowedRoles={["admin", "user"]}
                    >
                        <FilesPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/categories"
                element={
                    <ProtectedRoute
                        allowedRoles={["admin", "user"]}
                    >
                        <CategoriesPage />
                    </ProtectedRoute>
                }
            />

            <Route path="/*" element={<Navigate to="/login" replace />} />

        </Routes>
    );
}