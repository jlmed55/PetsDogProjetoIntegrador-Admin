import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate("/login");
    }

    return (
        <div>
            <nav className="flex flex-wrap items-center gap-4 bg-gray-800 px-4 py-3 text-white">
                <Link to="/app/dashboard" className="font-bold">PetShop Admin</Link>
                <Link to="/app/clientes">Clientes</Link>
                <Link to="/app/animais">Animais</Link>
                <Link to="/app/profissionais">Profissionais</Link>
                <Link to="/app/servicos">Serviços</Link>
                <Link to="/app/agendamentos">Agendamentos</Link>
                <Link to="/app/relatorios">Relatórios</Link>

                <div className="ml-auto flex items-center gap-3">
                    <span className="text-sm">{user?.name}</span>
                    <button
                        onClick={handleLogout}
                        className="rounded bg-red-600 px-3 py-1 text-sm hover:bg-red-700"
                    >
                        Sair
                    </button>
                </div>
            </nav>

            <main className="p-4">{children}</main>
        </div>
    );
}
