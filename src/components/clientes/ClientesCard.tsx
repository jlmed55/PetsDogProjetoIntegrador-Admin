import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { Modal } from "../Modal";
import {
    buscarClientePorId,
    criarCliente,
    atualizarCliente,
} from "../../services/clientesService";
import type { Cliente } from "../../types/clientes";
import type { ModalMode } from "../../types/modal";

interface ClientesCardProps {
    isOpen: boolean;
    mode: ModalMode;
    id: string | null;
    onClose: () => void;
    onSaved: () => void;
}

const formVazio: Cliente = { name: "", email: "", telefone: "", senha: "" };

const titulos: Record<ModalMode, string> = {
    create: "Novo cliente",
    edit: "Editar cliente",
    view: "Visualizar cliente",
};

export function ClientesCard({ isOpen, mode, id, onClose, onSaved }: ClientesCardProps) {
    const [form, setForm] = useState<Cliente>(formVazio);
    const [saving, setSaving] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (!isOpen) return;
        setErro("");
        if (mode === "create" || !id) {
            setForm(formVazio);
            return;
        }
        buscarClientePorId(id)
            .then((cliente) =>
                setForm({
                    name: cliente.name,
                    email: cliente.email,
                    telefone: cliente.telefone,
                    senha: "",
                })
            )
            .catch(() => setErro("Erro ao carregar cliente."));
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
                await atualizarCliente(id, form);
            } else {
                await criarCliente(form);
            }
            onSaved();
            onClose();
        } catch {
            setErro("Erro ao salvar cliente.");
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
                <input name="email" placeholder="Email" value={form.email} onChange={handleChange} disabled={disabled} className="rounded border px-2 py-1 disabled:bg-gray-100" />
                <input name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} disabled={disabled} className="rounded border px-2 py-1 disabled:bg-gray-100" />
                {mode !== "view" && (
                    <input name="senha" type="password" placeholder="Senha" value={form.senha} onChange={handleChange} disabled={disabled} className="rounded border px-2 py-1 disabled:bg-gray-100" />
                )}
            </div>
        </Modal>
    );
}
