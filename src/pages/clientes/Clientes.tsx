import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
    listarClientes,
    criarCliente,
    atualizarCliente,
    removerCliente,
} from "../../services/clientesService";
import type { Cliente } from "../../types/clientes";

const formVazio: Cliente = { name: "", email: "", telefone: "", senha: "" };

export function ClientesPage() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [form, setForm] = useState<Cliente>(formVazio);
    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

    async function carregar() {
        try {
            const dados = await listarClientes();
            setClientes(dados);
        } catch {
            setErro("Erro ao carregar clientes.");
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
                await atualizarCliente(editandoId, form);
                setMensagem("Cliente atualizado com sucesso!");
            } else {
                await criarCliente(form);
                setMensagem("Cliente criado com sucesso!");
            }
            setForm(formVazio);
            setEditandoId(null);
            carregar();
        } catch {
            setErro("Erro ao salvar cliente.");
        }
    }

    function handleEditar(cliente: Cliente) {
        setForm({
            name: cliente.name,
            email: cliente.email,
            telefone: cliente.telefone,
            senha: "",
        });
        setEditandoId(cliente._id ?? null);
        setMensagem("");
        setErro("");
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
            <h1 className="mb-4 text-2xl font-bold">Clientes</h1>

            {mensagem && <p className="mb-2 text-green-600">{mensagem}</p>}
            {erro && <p className="mb-2 text-red-600">{erro}</p>}

            <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-2">
                <input name="name" placeholder="Nome" value={form.name} onChange={handleChange} required className="rounded border px-2 py-1" />
                <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="rounded border px-2 py-1" />
                <input name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} required className="rounded border px-2 py-1" />
                <input name="senha" placeholder="Senha" value={form.senha} onChange={handleChange} className="rounded border px-2 py-1" />
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
                                <button onClick={() => handleEditar(cliente)} className="mr-2 text-blue-600">Editar</button>
                                <button onClick={() => handleExcluir(cliente._id!)} className="text-red-600">Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
