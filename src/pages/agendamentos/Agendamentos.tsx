import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
    listarAgendamentos,
    criarAgendamento,
    atualizarAgendamento,
    removerAgendamento,
} from "../../services/agendamentosService";
import type { Agendamento } from "../../types/agendamentos";
import { listarClientes } from "../../services/clientesService";
import type { Cliente } from "../../types/clientes";
import { listarAnimais } from "../../services/animaisService";
import type { Animal } from "../../types/animais";
import { listarProfissionais } from "../../services/profissionaisService";
import type { Profissional } from "../../types/profissionais";
import { listarServicos } from "../../services/servicosService";
import type { Servico } from "../../types/servicos";

const formVazio = {
    data_hora: "",
    status: "agendado",
    observacoes: "",
    clienteId: "",
    animalId: "",
    profissionalId: "",
    servicoId: "",
};

export function AgendamentosPage() {
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [animais, setAnimais] = useState<Animal[]>([]);
    const [profissionais, setProfissionais] = useState<Profissional[]>([]);
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [form, setForm] = useState(formVazio);
    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

    async function carregar() {
        try {
            setAgendamentos(await listarAgendamentos());
            setClientes(await listarClientes());
            setAnimais(await listarAnimais());
            setProfissionais(await listarProfissionais());
            setServicos(await listarServicos());
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
        try {
            if (editandoId) {
                await atualizarAgendamento(editandoId, form);
                setMensagem("Agendamento atualizado com sucesso!");
            } else {
                await criarAgendamento(form);
                setMensagem("Agendamento criado com sucesso!");
            }
            setForm(formVazio);
            setEditandoId(null);
            carregar();
        } catch {
            setErro("Erro ao salvar agendamento.");
        }
    }

    function handleEditar(agendamento: Agendamento) {
        setForm({
            data_hora: (agendamento.data_hora ?? "").slice(0, 16),
            status: agendamento.status,
            observacoes: agendamento.observacoes ?? "",
            clienteId: agendamento.cliente?._id ?? "",
            animalId: agendamento.animal?._id ?? "",
            profissionalId: agendamento.profissional?._id ?? "",
            servicoId: agendamento.servico?._id ?? "",
        });
        setEditandoId(agendamento._id ?? null);
        setMensagem("");
        setErro("");
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
            <h1 className="mb-4 text-2xl font-bold">Agendamentos</h1>

            {mensagem && <p className="mb-2 text-green-600">{mensagem}</p>}
            {erro && <p className="mb-2 text-red-600">{erro}</p>}

            <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-2">
                <input name="data_hora" type="datetime-local" value={form.data_hora} onChange={handleChange} required className="rounded border px-2 py-1" />
                <select name="status" value={form.status} onChange={handleChange} className="rounded border px-2 py-1">
                    <option value="agendado">agendado</option>
                    <option value="concluido">concluído</option>
                    <option value="cancelado">cancelado</option>
                    <option value="falta">falta</option>
                </select>
                <select name="clienteId" value={form.clienteId} onChange={handleChange} required className="rounded border px-2 py-1">
                    <option value="">Cliente...</option>
                    {clientes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
                <select name="animalId" value={form.animalId} onChange={handleChange} required className="rounded border px-2 py-1">
                    <option value="">Animal...</option>
                    {animais.map((a) => <option key={a._id} value={a._id}>{a.nome}</option>)}
                </select>
                <select name="profissionalId" value={form.profissionalId} onChange={handleChange} required className="rounded border px-2 py-1">
                    <option value="">Profissional...</option>
                    {profissionais.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
                <select name="servicoId" value={form.servicoId} onChange={handleChange} required className="rounded border px-2 py-1">
                    <option value="">Serviço...</option>
                    {servicos.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
                <input name="observacoes" placeholder="Observações" value={form.observacoes} onChange={handleChange} className="rounded border px-2 py-1" />
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
                                <button onClick={() => handleEditar(agendamento)} className="mr-2 text-blue-600">Editar</button>
                                <button onClick={() => handleExcluir(agendamento._id!)} className="text-red-600">Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
