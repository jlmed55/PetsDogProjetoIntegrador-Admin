import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";

type UserRole = "admin" | "user" | null;

interface ProtectedRouteProps {
    allowedRoles: UserRole[];
    children: ReactNode;
}

const authMock = {
    isAuthenticated: true,
    user: {
        name: "User",
        role: "admin" as UserRole
    }
};

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {

    if (!authMock.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(authMock.user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}