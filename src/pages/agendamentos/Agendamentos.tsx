import { useEffect, useState } from "react";
import {
    listarAgendamentos,
    removerAgendamento,
} from "../../services/agendamentosService";
import type { Agendamento } from "../../types/agendamentos";
import type { ModalMode } from "../../types/modal";
import { AgendamentosCard } from "../../components/agendamentos/AgendamentosCard";

export function AgendamentosPage() {
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [modalMode, setModalMode] = useState<ModalMode>("create");
    const [selecionadoId, setSelecionadoId] = useState<string | null>(null);

    async function carregar() {
        try {
            setAgendamentos(await listarAgendamentos());
        } catch {
            setErro("Erro ao carregar agendamentos.");
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
        if (!confirm("Deseja excluir este agendamento?")) return;
        try {
            await removerAgendamento(id);
            setMensagem("Agendamento excluído.");
            carregar();
        } catch {
            setErro("Erro ao excluir agendamento.");
        }
    }

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Agendamentos</h1>
                <button onClick={() => abrirModal("create")} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                    Criar novo
                </button>
            </div>

            {mensagem && <p className="mb-2 text-green-600">{mensagem}</p>}
            {erro && <p className="mb-2 text-red-600">{erro}</p>}

            <table className="w-full border-collapse text-left">
                <thead>
                    <tr className="border-b">
                        <th className="p-2">Data/Hora</th>
                        <th className="p-2">Cliente</th>
                        <th className="p-2">Animal</th>
                        <th className="p-2">Serviço</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {agendamentos.map((agendamento) => (
                        <tr key={agendamento._id} className="border-b">
                            <td className="p-2">{(agendamento.data_hora ?? "").slice(0, 16).replace("T", " ")}</td>
                            <td className="p-2">{agendamento.cliente?.name}</td>
                            <td className="p-2">{agendamento.animal?.nome}</td>
                            <td className="p-2">{agendamento.servico?.name}</td>
                            <td className="p-2">{agendamento.status}</td>
                            <td className="p-2">
                                <button onClick={() => abrirModal("view", agendamento._id!)} className="mr-2 text-gray-600">Visualizar</button>
                                <button onClick={() => abrirModal("edit", agendamento._id!)} className="mr-2 text-blue-600">Editar</button>
                                <button onClick={() => handleExcluir(agendamento._id!)} className="text-red-600">Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <AgendamentosCard
                isOpen={modalAberto}
                mode={modalMode}
                id={selecionadoId}
                onClose={() => setModalAberto(false)}
                onSaved={carregar}
            />
        </div>
    );
}
