import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { Modal } from "../Modal";
import {
    buscarAgendamentoPorId,
    criarAgendamento,
    atualizarAgendamento,
} from "../../services/agendamentosService";
import { listarClientes } from "../../services/clientesService";
import { listarAnimais } from "../../services/animaisService";
import { listarProfissionais } from "../../services/profissionaisService";
import { listarServicos } from "../../services/servicosService";
import type { Cliente } from "../../types/clientes";
import type { Animal } from "../../types/animais";
import type { Profissional } from "../../types/profissionais";
import type { Servico } from "../../types/servicos";
import type { ModalMode } from "../../types/modal";

interface AgendamentosCardProps {
    isOpen: boolean;
    mode: ModalMode;
    id: string | null;
    onClose: () => void;
    onSaved: () => void;
}

const formVazio = {
    data_hora: "",
    status: "agendado",
    observacoes: "",
    clienteId: "",
    animalId: "",
    profissionalId: "",
    servicoId: "",
};

const titulos: Record<ModalMode, string> = {
    create: "Novo agendamento",
    edit: "Editar agendamento",
    view: "Visualizar agendamento",
};

export function AgendamentosCard({ isOpen, mode, id, onClose, onSaved }: AgendamentosCardProps) {
    const [form, setForm] = useState(formVazio);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [animais, setAnimais] = useState<Animal[]>([]);
    const [profissionais, setProfissionais] = useState<Profissional[]>([]);
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [saving, setSaving] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (!isOpen) return;
        setErro("");
        Promise.all([
            listarClientes(),
            listarAnimais(),
            listarProfissionais(),
            listarServicos(),
        ])
            .then(([cli, ani, prof, serv]) => {
                setClientes(cli);
                setAnimais(ani);
                setProfissionais(prof);
                setServicos(serv);
            })
            .catch(() => setErro("Erro ao carregar dados."));

        if (mode === "create" || !id) {
            setForm(formVazio);
            return;
        }
        buscarAgendamentoPorId(id)
            .then((agendamento) =>
                setForm({
                    data_hora: (agendamento.data_hora ?? "").slice(0, 16),
                    status: agendamento.status,
                    observacoes: agendamento.observacoes ?? "",
                    clienteId: agendamento.cliente?._id ?? "",
                    animalId: agendamento.animal?._id ?? "",
                    profissionalId: agendamento.profissional?._id ?? "",
                    servicoId: agendamento.servico?._id ?? "",
                })
            )
            .catch(() => setErro("Erro ao carregar agendamento."));
    }, [isOpen, mode, id]);

    const disabled = mode === "view";

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSave() {
        setSaving(true);
        setErro("");
        try {
            if (mode === "edit" && id) {
                await atualizarAgendamento(id, form);
            } else {
                await criarAgendamento(form);
            }
            onSaved();
            onClose();
        } catch {
            setErro("Erro ao salvar agendamento.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            title={titulos[mode]}
            mode={mode}
            saving={saving}
            onClose={onClose}
            onSave={handleSave}
        >
            {erro && <p className="mb-2 text-red-600">{erro}</p>}
            <div className="flex flex-col gap-3">
                <label className="text-sm text-gray-600">Data/Hora</label>
                <input name="data_hora" type="datetime-local" value={form.data_hora} onChange={handleChange} disabled={disabled} className="rounded border px-2 py-1 disabled:bg-gray-100" />
                <select name="status" value={form.status} onChange={handleChange} disabled={disabled} className="rounded border px-2 py-1 disabled:bg-gray-100">
                    <option value="agendado">agendado</option>
                    <option value="concluido">concluído</option>
                    <option value="cancelado">cancelado</option>
                    <option value="falta">falta</option>
                </select>
                <select name="clienteId" value={form.clienteId} onChange={handleChange} disabled={disabled} className="rounded border px-2 py-1 disabled:bg-gray-100">
                    <option value="">Cliente...</option>
                    {clientes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
                <select name="animalId" value={form.animalId} onChange={handleChange} disabled={disabled} className="rounded border px-2 py-1 disabled:bg-gray-100">
                    <option value="">Animal...</option>
                    {animais.map((a) => <option key={a._id} value={a._id}>{a.nome}</option>)}
                </select>
                <select name="profissionalId" value={form.profissionalId} onChange={handleChange} disabled={disabled} className="rounded border px-2 py-1 disabled:bg-gray-100">
                    <option value="">Profissional...</option>
                    {profissionais.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
                <select name="servicoId" value={form.servicoId} onChange={handleChange} disabled={disabled} className="rounded border px-2 py-1 disabled:bg-gray-100">
                    <option value="">Serviço...</option>
                    {servicos.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
                <input name="observacoes" placeholder="Observações" value={form.observacoes} onChange={handleChange} disabled={disabled} className="rounded border px-2 py-1 disabled:bg-gray-100" />
            </div>
        </Modal>
    );
}
