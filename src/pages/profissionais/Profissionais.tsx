import { useEffect, useState } from "react";
import {
    listarProfissionais,
    removerProfissional,
} from "../../services/profissionaisService";
import type { Profissional } from "../../types/profissionais";
import type { ModalMode } from "../../types/modal";
import { ProfissionaisCard } from "../../components/profissionais/ProfissionaisCard";

export function ProfissionaisPage() {
    const [profissionais, setProfissionais] = useState<Profissional[]>([]);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [modalMode, setModalMode] = useState<ModalMode>("create");
    const [selecionadoId, setSelecionadoId] = useState<string | null>(null);

    async function carregar() {
        try {
            setProfissionais(await listarProfissionais());
        } catch {
            setErro("Erro ao carregar profissionais.");
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
        if (!confirm("Deseja excluir este profissional?")) return;
        try {
            await removerProfissional(id);
            setMensagem("Profissional excluído.");
            carregar();
        } catch {
            setErro("Erro ao excluir profissional.");
        }
    }

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Profissionais</h1>
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
                        <th className="p-2">Especialidade</th>
                        <th className="p-2">Início</th>
                        <th className="p-2">Fim</th>
                        <th className="p-2">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {profissionais.map((profissional) => (
                        <tr key={profissional._id} className="border-b">
                            <td className="p-2">{profissional.name}</td>
                            <td className="p-2">{profissional.especialidade}</td>
                            <td className="p-2">{(profissional.disponibilidade_inicio ?? "").slice(0, 16).replace("T", " ")}</td>
                            <td className="p-2">{(profissional.disponibilidade_fim ?? "").slice(0, 16).replace("T", " ")}</td>
                            <td className="p-2">
                                <button onClick={() => abrirModal("view", profissional._id!)} className="mr-2 text-gray-600">Visualizar</button>
                                <button onClick={() => abrirModal("edit", profissional._id!)} className="mr-2 text-blue-600">Editar</button>
                                <button onClick={() => handleExcluir(profissional._id!)} className="text-red-600">Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ProfissionaisCard
                isOpen={modalAberto}
                mode={modalMode}
                id={selecionadoId}
                onClose={() => setModalAberto(false)}
                onSaved={carregar}
            />
        </div>
    );
}
