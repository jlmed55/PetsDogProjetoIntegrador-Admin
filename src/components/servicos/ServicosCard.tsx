import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { Modal } from "../Modal";
import {
    buscarServicoPorId,
    criarServico,
    atualizarServico,
} from "../../services/servicosService";
import type { Servico } from "../../types/servicos";
import type { ModalMode } from "../../types/modal";

interface ServicosCardProps {
    isOpen: boolean;
    mode: ModalMode;
    id: string | null;
    onClose: () => void;
    onSaved: () => void;
}

const formVazio = {
    name: "",
    tipo: "banho",
    duracao_min: "",
    preco: "",
};

const titulos: Record<ModalMode, string> = {
    create: "Novo serviço",
    edit: "Editar serviço",
    view: "Visualizar serviço",
};

export function ServicosCard({ isOpen, mode, id, onClose, onSaved }: ServicosCardProps) {
    const [form, setForm] = useState(formVazio);
    const [saving, setSaving] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (!isOpen) return;
        setErro("");
        if (mode === "create" || !id) {
            setForm(formVazio);
            return;
        }
        buscarServicoPorId(id)
            .then((servico) =>
                setForm({
                    name: servico.name,
                    tipo: servico.tipo,
                    duracao_min: String(servico.duracao_min ?? ""),
                    preco: String(servico.preco ?? ""),
                })
            )
            .catch(() => setErro("Erro ao carregar serviço."));
    }, [isOpen, mode, id]);

    const disabled = mode === "view";

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSave() {
        setSaving(true);
        setErro("");
        const payload: Servico = {
            name: form.name,
            tipo: form.tipo,
            duracao_min: Number(form.duracao_min),
            preco: Number(form.preco),
        };
        try {
            if (mode === "edit" && id) {
                await atualizarServico(id, payload);
            } else {
                await criarServico(payload);
            }
            onSaved();
            onClose();
        } catch {
            setErro("Erro ao salvar serviço.");
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
                <input name="name" placeholder="Nome" value={form.name} onChange={handleChange} disabled={disabled} className="rounded border px-2 py-1 disabled:bg-gray-100" />
                <select name="tipo" value={form.tipo} onChange={handleChange} disabled={disabled} className="rounded border px-2 py-1 disabled:bg-gray-100">
                    <option value="banho">banho</option>
                    <option value="tosa">tosa</option>
                    <option value="ambos">ambos</option>
                </select>
                <input name="duracao_min" type="number" placeholder="Duração (min)" value={form.duracao_min} onChange={handleChange} disabled={disabled} className="rounded border px-2 py-1 disabled:bg-gray-100" />
                <input name="preco" type="number" placeholder="Preço" value={form.preco} onChange={handleChange} disabled={disabled} className="rounded border px-2 py-1 disabled:bg-gray-100" />
            </div>
        </Modal>
    );
}
