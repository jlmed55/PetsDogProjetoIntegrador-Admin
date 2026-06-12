import { useEffect, useState } from "react";
import {
    listarRelatorios,
    removerRelatorio,
} from "../../services/relatoriosService";
import type { Relatorio } from "../../types/relatorios";
import type { ModalMode } from "../../types/modal";
import { RelatoriosCard } from "../../components/relatorios/RelatoriosCard";

export function RelatoriosPage() {
    const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [modalMode, setModalMode] = useState<ModalMode>("create");
    const [selecionadoId, setSelecionadoId] = useState<string | null>(null);

    async function carregar() {
        try {
            setRelatorios(await listarRelatorios());
        } catch {
            setErro("Erro ao carregar relatórios.");
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
        if (!confirm("Deseja excluir este relatório?")) return;
        try {
            await removerRelatorio(id);
            setMensagem("Relatório excluído.");
            carregar();
        } catch {
            setErro("Erro ao excluir relatório.");
        }
    }

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Relatórios</h1>
                <button onClick={() => abrirModal("create")} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                    Criar novo
                </button>
            </div>

            {mensagem && <p className="mb-2 text-green-600">{mensagem}</p>}
            {erro && <p className="mb-2 text-red-600">{erro}</p>}

            <table className="w-full border-collapse text-left">
                <thead>
                    <tr className="border-b">
                        <th className="p-2">Clientes</th>
                        <th className="p-2">Animais</th>
                        <th className="p-2">Serviços</th>
                        <th className="p-2">Cancelamentos</th>
                        <th className="p-2">Faltas</th>
                        <th className="p-2">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {relatorios.map((relatorio) => (
                        <tr key={relatorio._id} className="border-b">
                            <td className="p-2">{relatorio.total_clientes}</td>
                            <td className="p-2">{relatorio.total_animais}</td>
                            <td className="p-2">{relatorio.total_servicos}</td>
                            <td className="p-2">{relatorio.total_cancelamentos}</td>
                            <td className="p-2">{relatorio.total_faltas}</td>
                            <td className="p-2">
                                <button onClick={() => abrirModal("view", relatorio._id!)} className="mr-2 text-gray-600">Visualizar</button>
                                <button onClick={() => handleExcluir(relatorio._id!)} className="text-red-600">Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <RelatoriosCard
                isOpen={modalAberto}
                mode={modalMode}
                id={selecionadoId}
                onClose={() => setModalAberto(false)}
                onSaved={carregar}
            />
        </div>
    );
}
