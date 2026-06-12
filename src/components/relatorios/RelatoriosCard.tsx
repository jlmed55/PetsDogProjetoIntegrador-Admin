import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { Modal } from "../Modal";
import {
    buscarRelatorioPorId,
    criarRelatorio,
} from "../../services/relatoriosService";
import type { Relatorio } from "../../types/relatorios";
import type { ModalMode } from "../../types/modal";

interface RelatoriosCardProps {
    isOpen: boolean;
    mode: ModalMode;
    id: string | null;
    onClose: () => void;
    onSaved: () => void;
}

const formVazio = {
    total_clientes: "",
    total_animais: "",
    total_servicos: "",
    total_cancelamentos: "",
    total_faltas: "",
};

const titulos: Record<ModalMode, string> = {
    create: "Novo relatório",
    edit: "Editar relatório",
    view: "Visualizar relatório",
};

export function RelatoriosCard({ isOpen, mode, id, onClose, onSaved }: RelatoriosCardProps) {
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
        buscarRelatorioPorId(id)
            .then((relatorio) =>
                setForm({
                    total_clientes: String(relatorio.total_clientes ?? ""),
                    total_animais: String(relatorio.total_animais ?? ""),
                    total_servicos: String(relatorio.total_servicos ?? ""),
                    total_cancelamentos: String(relatorio.total_cancelamentos ?? ""),
                    total_faltas: String(relatorio.total_faltas ?? ""),
                })
            )
            .catch(() => setErro("Erro ao carregar relatório."));
    }, [isOpen, mode, id]);

    const disabled = mode === "view";

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSave() {
        setSaving(true);
        setErro("");
        const payload: Relatorio = {
            total_clientes: Number(form.total_clientes),
            total_animais: Number(form.total_animais),
            total_servicos: Number(form.total_servicos),
            total_cancelamentos: Number(form.total_cancelamentos),
            total_faltas: Number(form.total_faltas),
        };
        try {
            await criarRelatorio(payload);
            onSaved();
            onClose();
        } catch {
            setErro("Erro ao salvar relatório.");
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
                <input name="total_clientes" type="number" placeholder="Total clientes" value={form.total_clientes} onChange={handleChange} disabled={disabled} className="rounded border px-2 py-1 disabled:bg-gray-100" />
                <input name="total_animais" type="number" placeholder="Total animais" value={form.total_animais} onChange={handleChange} disabled={disabled} className="rounded border px-2 py-1 disabled:bg-gray-100" />
                <input name="total_servicos" type="number" placeholder="Total serviços" value={form.total_servicos} onChange={handleChange} disabled={disabled} className="rounded border px-2 py-1 disabled:bg-gray-100" />
                <input name="total_cancelamentos" type="number" placeholder="Cancelamentos" value={form.total_cancelamentos} onChange={handleChange} disabled={disabled} className="rounded border px-2 py-1 disabled:bg-gray-100" />
                <input name="total_faltas" type="number" placeholder="Faltas" value={form.total_faltas} onChange={handleChange} disabled={disabled} className="rounded border px-2 py-1 disabled:bg-gray-100" />
            </div>
        </Modal>
    );
}
