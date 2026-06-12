import { useEffect, useState } from "react";
import {
    listarClientes,
    removerCliente,
} from "../../services/clientesService";
import type { Cliente } from "../../types/clientes";
import type { ModalMode } from "../../types/modal";
import { ClientesCard } from "../../components/clientes/ClientesCard";

export function ClientesPage() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [modalMode, setModalMode] = useState<ModalMode>("create");
    const [selecionadoId, setSelecionadoId] = useState<string | null>(null);

    async function carregar() {
        try {
            setClientes(await listarClientes());
        } catch {
            setErro("Erro ao carregar clientes.");
        }
    }

    useEffect(() => {
        carregar();
    }, []);

    function abrirModal(mode: ModalMode, id: string | null = null) {
        setModalMode(mode);
        setSelecionadoId(id);
        setModalAberto(true);
    }

    async function handleExcluir(id: string) {
        if (!confirm("Deseja excluir este cliente?")) return;
        try {
            await removerCliente(id);
            setMensagem("Cliente excluído.");
            carregar();
        } catch {
            setErro("Erro ao excluir cliente.");
        }
    }

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Clientes</h1>
                <button onClick={() => abrirModal("create")} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                    Criar novo
                </button>
            </div>

            {mensagem && <p className="mb-2 text-green-600">{mensagem}</p>}
            {erro && <p className="mb-2 text-red-600">{erro}</p>}

            <table className="w-full border-collapse text-left">
                <thead>
                    <tr className="border-b">
                        <th className="p-2">Nome</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Telefone</th>
                        <th className="p-2">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map((cliente) => (
                        <tr key={cliente._id} className="border-b">
                            <td className="p-2">{cliente.name}</td>
                            <td className="p-2">{cliente.email}</td>
                            <td className="p-2">{cliente.telefone}</td>
                            <td className="p-2">
                                <button onClick={() => abrirModal("view", cliente._id!)} className="mr-2 text-gray-600">Visualizar</button>
                                <button onClick={() => abrirModal("edit", cliente._id!)} className="mr-2 text-blue-600">Editar</button>
                                <button onClick={() => handleExcluir(cliente._id!)} className="text-red-600">Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ClientesCard
                isOpen={modalAberto}
                mode={modalMode}
                id={selecionadoId}
                onClose={() => setModalAberto(false)}
                onSaved={carregar}
            />
        </div>
    );
}
