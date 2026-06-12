import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { Modal } from "../Modal";
import {
    buscarProfissionalPorId,
    criarProfissional,
    atualizarProfissional,
} from "../../services/profissionaisService";
import type { Profissional } from "../../types/profissionais";
import type { ModalMode } from "../../types/modal";

interface ProfissionaisCardProps {
    isOpen: boolean;
    mode: ModalMode;
    id: string | null;
    onClose: () => void;
    onSaved: () => void;
}

const formVazio: Profissional = {
    name: "",
    especialidade: "",
    disponibilidade_inicio: "",
    disponibilidade_fim: "",
};

const titulos: Record<ModalMode, string> = {
    create: "Novo profissional",
    edit: "Editar profissional",
    view: "Visualizar profissional",
};

export function ProfissionaisCard({ isOpen, mode, id, onClose, onSaved }: ProfissionaisCardProps) {
    const [form, setForm] = useState<Profissional>(formVazio);
    const [saving, setSaving] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (!isOpen) return;
        setErro("");
        if (mode === "create" || !id) {
            setForm(formVazio);
            return;
        }
        buscarProfissionalPorId(id)
            .then((profissional) =>
                setForm({
                    name: profissional.name,
                    especialidade: profissional.especialidade,
                    disponibilidade_inicio: (profissional.disponibilidade_inicio ?? "").slice(0, 16),
                    disponibilidade_fim: (profissional.disponibilidade_fim ?? "").slice(0, 16),
                })
            )
            .catch(() => setErro("Erro ao carregar profissional."));
    }, [isOpen, mode, id]);

    const disabled = mode === "view";

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSave() {
        setSaving(true);
        setErro("");
        try {
            if (mode === "edit" && id) {
                await atualizarProfissional(id, form);
            } else {
                await criarProfissional(form);
            }
            onSaved();
            onClose();
        } catch {
            setErro("Erro ao salvar profissional.");
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
                <input name="especialidade" placeholder="Especialidade" value={form.especialidade} onChange={handleChange} disabled={disabled} className="rounded border px-2 py-1 disabled:bg-gray-100" />
                <label className="text-sm text-gray-600">Disponibilidade início</label>
                <input name="disponibilidade_inicio" type="datetime-local" value={form.disponibilidade_inicio} onChange={handleChange} disabled={disabled} className="rounded border px-2 py-1 disabled:bg-gray-100" />
                <label className="text-sm text-gray-600">Disponibilidade fim</label>
                <input name="disponibilidade_fim" type="datetime-local" value={form.disponibilidade_fim} onChange={handleChange} disabled={disabled} className="rounded border px-2 py-1 disabled:bg-gray-100" />
            </div>
        </Modal>
    );
}
