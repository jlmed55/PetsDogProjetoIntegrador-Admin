import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
    listarAnimais,
    criarAnimal,
    atualizarAnimal,
    removerAnimal,
} from "../../services/animaisService";
import type { Animal } from "../../types/animais";
import { listarClientes } from "../../services/clientesService";
import type { Cliente } from "../../types/clientes";

const formVazio = {
    id_animal: "",
    nome: "",
    especie: "",
    idade: "",
    porte: "",
    observacoes_saude: "",
    preferencias_especificas: "",
    clienteId: "",
};

export function AnimaisPage() {
    const [animais, setAnimais] = useState<Animal[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [form, setForm] = useState(formVazio);
    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

    async function carregar() {
        try {
            setAnimais(await listarAnimais());
            setClientes(await listarClientes());
        } catch {
            setErro("Erro ao carregar dados.");
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

        const payload: Animal = {
            id_animal: Number(form.id_animal),
            nome: form.nome,
            especie: form.especie,
            idade: Number(form.idade),
            porte: form.porte,
            observacoes_saude: form.observacoes_saude,
            preferencias_especificas: form.preferencias_especificas,
            clienteId: form.clienteId,
        };

        try {
            if (editandoId) {
                await atualizarAnimal(editandoId, payload);
                setMensagem("Animal atualizado com sucesso!");
            } else {
                await criarAnimal(payload);
                setMensagem("Animal criado com sucesso!");
            }
            setForm(formVazio);
            setEditandoId(null);
            carregar();
        } catch {
            setErro("Erro ao salvar animal.");
        }
    }

    function handleEditar(animal: Animal) {
        setForm({
            id_animal: String(animal.id_animal ?? ""),
            nome: animal.nome,
            especie: animal.especie,
            idade: String(animal.idade ?? ""),
            porte: animal.porte,
            observacoes_saude: animal.observacoes_saude ?? "",
            preferencias_especificas: animal.preferencias_especificas ?? "",
            clienteId: animal.clienteId ?? "",
        });
        setEditandoId(animal._id ?? null);
        setMensagem("");
        setErro("");
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
            <h1 className="mb-4 text-2xl font-bold">Animais</h1>

            {mensagem && <p className="mb-2 text-green-600">{mensagem}</p>}
            {erro && <p className="mb-2 text-red-600">{erro}</p>}

            <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-2">
                <input name="id_animal" type="number" placeholder="ID animal" value={form.id_animal} onChange={handleChange} required className="rounded border px-2 py-1 w-28" />
                <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} required className="rounded border px-2 py-1" />
                <input name="especie" placeholder="Espécie" value={form.especie} onChange={handleChange} required className="rounded border px-2 py-1" />
                <input name="idade" type="number" placeholder="Idade" value={form.idade} onChange={handleChange} required className="rounded border px-2 py-1 w-24" />
                <input name="porte" placeholder="Porte" value={form.porte} onChange={handleChange} required className="rounded border px-2 py-1" />
                <input name="observacoes_saude" placeholder="Obs. saúde" value={form.observacoes_saude} onChange={handleChange} className="rounded border px-2 py-1" />
                <input name="preferencias_especificas" placeholder="Preferências" value={form.preferencias_especificas} onChange={handleChange} className="rounded border px-2 py-1" />
                <select name="clienteId" value={form.clienteId} onChange={handleChange} required className="rounded border px-2 py-1">
                    <option value="">Cliente...</option>
                    {clientes.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                </select>
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
                                <button onClick={() => handleEditar(animal)} className="mr-2 text-blue-600">Editar</button>
                                <button onClick={() => handleExcluir(animal._id!)} className="text-red-600">Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
