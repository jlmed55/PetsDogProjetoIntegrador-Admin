import { useEffect, useState } from "react";
import {
    listarAnimais,
    removerAnimal,
} from "../../services/animaisService";
import type { Animal } from "../../types/animais";
import type { ModalMode } from "../../types/modal";
import { AnimaisCard } from "../../components/animais/AnimaisCard";

export function AnimaisPage() {
    const [animais, setAnimais] = useState<Animal[]>([]);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [modalMode, setModalMode] = useState<ModalMode>("create");
    const [selecionadoId, setSelecionadoId] = useState<string | null>(null);

    async function carregar() {
        try {
            setAnimais(await listarAnimais());
        } catch {
            setErro("Erro ao carregar animais.");
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
        if (!confirm("Deseja excluir este animal?")) return;
        try {
            await removerAnimal(id);
            setMensagem("Animal excluído.");
            carregar();
        } catch {
            setErro("Erro ao excluir animal.");
        }
    }

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Animais</h1>
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
                        <th className="p-2">Espécie</th>
                        <th className="p-2">Idade</th>
                        <th className="p-2">Porte</th>
                        <th className="p-2">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {animais.map((animal) => (
                        <tr key={animal._id} className="border-b">
                            <td className="p-2">{animal.nome}</td>
                            <td className="p-2">{animal.especie}</td>
                            <td className="p-2">{animal.idade}</td>
                            <td className="p-2">{animal.porte}</td>
                            <td className="p-2">
                                <button onClick={() => abrirModal("view", animal._id!)} className="mr-2 text-gray-600">Visualizar</button>
                                <button onClick={() => abrirModal("edit", animal._id!)} className="mr-2 text-blue-600">Editar</button>
                                <button onClick={() => handleExcluir(animal._id!)} className="text-red-600">Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <AnimaisCard
                isOpen={modalAberto}
                mode={modalMode}
                id={selecionadoId}
                onClose={() => setModalAberto(false)}
                onSaved={carregar}
            />
        </div>
    );
}
