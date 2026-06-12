import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { Modal } from "../Modal";
import {
    buscarAnimalPorId,
    criarAnimal,
    atualizarAnimal,
} from "../../services/animaisService";
import { listarClientes } from "../../services/clientesService";
import type { Animal } from "../../types/animais";
import type { Cliente } from "../../types/clientes";
import type { ModalMode } from "../../types/modal";

interface AnimaisCardProps {
    isOpen: boolean;
    mode: ModalMode;
    id: string | null;
    onClose: () => void;
    onSaved: () => void;
}

const formVazio = {
    nome: "",
    especie: "",
    idade: "",
    porte: "",
    observacoes_saude: "",
    preferencias_especificas: "",
    clienteId: "",
};

const titulos: Record<ModalMode, string> = {
    create: "Novo animal",
    edit: "Editar animal",
    view: "Visualizar animal",
};

export function AnimaisCard({ isOpen, mode, id, onClose, onSaved }: AnimaisCardProps) {
    const [form, setForm] = useState(formVazio);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [saving, setSaving] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (!isOpen) return;
        setErro("");
        listarClientes()
            .then(setClientes)
            .catch(() => setErro("Erro ao carregar clientes."));

        if (mode === "create" || !id) {
            setForm(formVazio);
            return;
        }
        buscarAnimalPorId(id)
            .then((animal) =>
                setForm({
                    nome: animal.nome,
                    especie: animal.especie,
                    idade: String(animal.idade ?? ""),
                    porte: animal.porte,
                    observacoes_saude: animal.observacoes_saude ?? "",
                    preferencias_especificas: animal.preferencias_especificas ?? "",
                    clienteId: animal.cliente?._id ?? animal.clienteId ?? "",
                })
            )
            .catch(() => setErro("Erro ao carregar animal."));
    }, [isOpen, mode, id]);

    const disabled = mode === "view";

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSave() {
        setSaving(true);
        setErro("");
        const payload: Animal = {
            nome: form.nome,
            especie: form.especie,
            idade: Number(form.idade),
            porte: form.porte,
            observacoes_saude: form.observacoes_saude,
            preferencias_especificas: form.preferencias_especificas,
            clienteId: form.clienteId,
        };
        try {
            if (mode === "edit" && id) {
                await atualizarAnimal(id, payload);
            } else {
                await criarAnimal(payload);
            }
            onSaved();
            onClose();
        } catch {
            setErro("Erro ao salvar animal.");
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
                <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} disabled={disabled} className="rounded border px-2 py-1 disabled:bg-gray-100" />
                <input name="especie" placeholder="Espécie" value={form.especie} onChange={handleChange} disabled={disabled} className="rounded border px-2 py-1 disabled:bg-gray-100" />
                <input name="idade" type="number" placeholder="Idade" value={form.idade} onChange={handleChange} disabled={disabled} className="rounded border px-2 py-1 disabled:bg-gray-100" />
                <input name="porte" placeholder="Porte" value={form.porte} onChange={handleChange} disabled={disabled} className="rounded border px-2 py-1 disabled:bg-gray-100" />
                <input name="observacoes_saude" placeholder="Obs. saúde" value={form.observacoes_saude} onChange={handleChange} disabled={disabled} className="rounded border px-2 py-1 disabled:bg-gray-100" />
                <input name="preferencias_especificas" placeholder="Preferências" value={form.preferencias_especificas} onChange={handleChange} disabled={disabled} className="rounded border px-2 py-1 disabled:bg-gray-100" />
                <select name="clienteId" value={form.clienteId} onChange={handleChange} disabled={disabled} className="rounded border px-2 py-1 disabled:bg-gray-100">
                    <option value="">Cliente...</option>
                    {clientes.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                </select>
            </div>
        </Modal>
    );
}
