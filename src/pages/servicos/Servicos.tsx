import { useEffect, useState } from "react";
import {
    listarServicos,
    removerServico,
} from "../../services/servicosService";
import type { Servico } from "../../types/servicos";
import type { ModalMode } from "../../types/modal";
import { ServicosCard } from "../../components/servicos/ServicosCard";

export function ServicosPage() {
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [modalMode, setModalMode] = useState<ModalMode>("create");
    const [selecionadoId, setSelecionadoId] = useState<string | null>(null);

    async function carregar() {
        try {
            setServicos(await listarServicos());
        } catch {
            setErro("Erro ao carregar serviços.");
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
        if (!confirm("Deseja excluir este serviço?")) return;
        try {
            await removerServico(id);
            setMensagem("Serviço excluído.");
            carregar();
        } catch {
            setErro("Erro ao excluir serviço.");
        }
    }

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Serviços</h1>
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
                        <th className="p-2">Tipo</th>
                        <th className="p-2">Duração</th>
                        <th className="p-2">Preço</th>
                        <th className="p-2">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {servicos.map((servico) => (
                        <tr key={servico._id} className="border-b">
                            <td className="p-2">{servico.name}</td>
                            <td className="p-2">{servico.tipo}</td>
                            <td className="p-2">{servico.duracao_min} min</td>
                            <td className="p-2">R$ {servico.preco}</td>
                            <td className="p-2">
                                <button onClick={() => abrirModal("view", servico._id!)} className="mr-2 text-gray-600">Visualizar</button>
                                <button onClick={() => abrirModal("edit", servico._id!)} className="mr-2 text-blue-600">Editar</button>
                                <button onClick={() => handleExcluir(servico._id!)} className="text-red-600">Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ServicosCard
                isOpen={modalAberto}
                mode={modalMode}
                id={selecionadoId}
                onClose={() => setModalAberto(false)}
                onSaved={carregar}
            />
        </div>
    );
}
