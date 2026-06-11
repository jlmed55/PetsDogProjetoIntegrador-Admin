import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
    listarProfissionais,
    criarProfissional,
    atualizarProfissional,
    removerProfissional,
} from "../../services/profissionaisService";
import type { Profissional } from "../../types/profissionais";

const formVazio: Profissional = {
    name: "",
    especialidade: "",
    disponibilidade_inicio: "",
    disponibilidade_fim: "",
};

export function ProfissionaisPage() {
    const [profissionais, setProfissionais] = useState<Profissional[]>([]);
    const [form, setForm] = useState<Profissional>(formVazio);
    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

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

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setErro("");
        setMensagem("");
        try {
            if (editandoId) {
                await atualizarProfissional(editandoId, form);
                setMensagem("Profissional atualizado com sucesso!");
            } else {
                await criarProfissional(form);
                setMensagem("Profissional criado com sucesso!");
            }
            setForm(formVazio);
            setEditandoId(null);
            carregar();
        } catch {
            setErro("Erro ao salvar profissional.");
        }
    }

    function handleEditar(profissional: Profissional) {
        setForm({
            name: profissional.name,
            especialidade: profissional.especialidade,
            disponibilidade_inicio: (profissional.disponibilidade_inicio ?? "").slice(0, 16),
            disponibilidade_fim: (profissional.disponibilidade_fim ?? "").slice(0, 16),
        });
        setEditandoId(profissional._id ?? null);
        setMensagem("");
        setErro("");
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
            <h1 className="mb-4 text-2xl font-bold">Profissionais</h1>

            {mensagem && <p className="mb-2 text-green-600">{mensagem}</p>}
            {erro && <p className="mb-2 text-red-600">{erro}</p>}

            <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-2">
                <input name="name" placeholder="Nome" value={form.name} onChange={handleChange} required className="rounded border px-2 py-1" />
                <input name="especialidade" placeholder="Especialidade" value={form.especialidade} onChange={handleChange} required className="rounded border px-2 py-1" />
                <input name="disponibilidade_inicio" type="datetime-local" value={form.disponibilidade_inicio} onChange={handleChange} required className="rounded border px-2 py-1" />
                <input name="disponibilidade_fim" type="datetime-local" value={form.disponibilidade_fim} onChange={handleChange} required className="rounded border px-2 py-1" />
                <button type="submit" className="rounded bg-blue-600 px-4 py-1 text-white hover:bg-blue-700">
                    {editandoId ? "Atualizar" : "Criar"}
                </button>
                {editandoId && (
                    <button type="button" onClick={() => { setForm(formVazio); setEditandoId(null); }} className="rounded bg-gray-400 px-4 py-1 text-white">
                        Cancelar
                    </button>
                )}
            </form>

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
                                <button onClick={() => handleEditar(profissional)} className="mr-2 text-blue-600">Editar</button>
                                <button onClick={() => handleExcluir(profissional._id!)} className="text-red-600">Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
