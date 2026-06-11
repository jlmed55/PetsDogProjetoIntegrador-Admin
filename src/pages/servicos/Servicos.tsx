import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
    listarServicos,
    criarServico,
    atualizarServico,
    removerServico,
} from "../../services/servicosService";
import type { Servico } from "../../types/servicos";

const formVazio = {
    name: "",
    tipo: "banho",
    duracao_min: "",
    preco: "",
};

export function ServicosPage() {
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [form, setForm] = useState(formVazio);
    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

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

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setErro("");
        setMensagem("");

        const payload: Servico = {
            name: form.name,
            tipo: form.tipo,
            duracao_min: Number(form.duracao_min),
            preco: Number(form.preco),
        };

        try {
            if (editandoId) {
                await atualizarServico(editandoId, payload);
                setMensagem("Serviço atualizado com sucesso!");
            } else {
                await criarServico(payload);
                setMensagem("Serviço criado com sucesso!");
            }
            setForm(formVazio);
            setEditandoId(null);
            carregar();
        } catch {
            setErro("Erro ao salvar serviço.");
        }
    }

    function handleEditar(servico: Servico) {
        setForm({
            name: servico.name,
            tipo: servico.tipo,
            duracao_min: String(servico.duracao_min ?? ""),
            preco: String(servico.preco ?? ""),
        });
        setEditandoId(servico._id ?? null);
        setMensagem("");
        setErro("");
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
            <h1 className="mb-4 text-2xl font-bold">Serviços</h1>

            {mensagem && <p className="mb-2 text-green-600">{mensagem}</p>}
            {erro && <p className="mb-2 text-red-600">{erro}</p>}

            <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-2">
                <input name="name" placeholder="Nome" value={form.name} onChange={handleChange} required className="rounded border px-2 py-1" />
                <select name="tipo" value={form.tipo} onChange={handleChange} className="rounded border px-2 py-1">
                    <option value="banho">banho</option>
                    <option value="tosa">tosa</option>
                    <option value="ambos">ambos</option>
                </select>
                <input name="duracao_min" type="number" placeholder="Duração (min)" value={form.duracao_min} onChange={handleChange} required className="rounded border px-2 py-1 w-32" />
                <input name="preco" type="number" placeholder="Preço" value={form.preco} onChange={handleChange} required className="rounded border px-2 py-1 w-28" />
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
                                <button onClick={() => handleEditar(servico)} className="mr-2 text-blue-600">Editar</button>
                                <button onClick={() => handleExcluir(servico._id!)} className="text-red-600">Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
