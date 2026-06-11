import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
    listarRelatorios,
    criarRelatorio,
    removerRelatorio,
} from "../../services/relatoriosService";
import type { Relatorio } from "../../types/relatorios";

const formVazio = {
    total_clientes: "",
    total_animais: "",
    total_servicos: "",
    total_cancelamentos: "",
    total_faltas: "",
};

export function RelatoriosPage() {
    const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
    const [form, setForm] = useState(formVazio);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

    async function carregar() {
        try {
            setRelatorios(await listarRelatorios());
        } catch {
            setErro("Erro ao carregar relatórios.");
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

        const payload: Relatorio = {
            total_clientes: Number(form.total_clientes),
            total_animais: Number(form.total_animais),
            total_servicos: Number(form.total_servicos),
            total_cancelamentos: Number(form.total_cancelamentos),
            total_faltas: Number(form.total_faltas),
        };

        try {
            await criarRelatorio(payload);
            setMensagem("Relatório criado com sucesso!");
            setForm(formVazio);
            carregar();
        } catch {
            setErro("Erro ao salvar relatório.");
        }
    }

    async function handleExcluir(id: string) {
        if (!confirm("Deseja excluir este relatório?")) return;
        try {
            await removerRelatorio(id);
            setMensagem("Relatório excluído.");
            carregar();
        } catch {
            setErro("Erro ao excluir relatório.");
        }
    }

    return (
        <div>
            <h1 className="mb-4 text-2xl font-bold">Relatórios</h1>

            {mensagem && <p className="mb-2 text-green-600">{mensagem}</p>}
            {erro && <p className="mb-2 text-red-600">{erro}</p>}

            <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-2">
                <input name="total_clientes" type="number" placeholder="Total clientes" value={form.total_clientes} onChange={handleChange} required className="rounded border px-2 py-1 w-36" />
                <input name="total_animais" type="number" placeholder="Total animais" value={form.total_animais} onChange={handleChange} required className="rounded border px-2 py-1 w-36" />
                <input name="total_servicos" type="number" placeholder="Total serviços" value={form.total_servicos} onChange={handleChange} required className="rounded border px-2 py-1 w-36" />
                <input name="total_cancelamentos" type="number" placeholder="Cancelamentos" value={form.total_cancelamentos} onChange={handleChange} required className="rounded border px-2 py-1 w-36" />
                <input name="total_faltas" type="number" placeholder="Faltas" value={form.total_faltas} onChange={handleChange} required className="rounded border px-2 py-1 w-28" />
                <button type="submit" className="rounded bg-blue-600 px-4 py-1 text-white hover:bg-blue-700">Criar</button>
            </form>

            <table className="w-full border-collapse text-left">
                <thead>
                    <tr className="border-b">
                        <th className="p-2">Clientes</th>
                        <th className="p-2">Animais</th>
                        <th className="p-2">Serviços</th>
                        <th className="p-2">Cancelamentos</th>
                        <th className="p-2">Faltas</th>
                        <th className="p-2">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {relatorios.map((relatorio) => (
                        <tr key={relatorio._id} className="border-b">
                            <td className="p-2">{relatorio.total_clientes}</td>
                            <td className="p-2">{relatorio.total_animais}</td>
                            <td className="p-2">{relatorio.total_servicos}</td>
                            <td className="p-2">{relatorio.total_cancelamentos}</td>
                            <td className="p-2">{relatorio.total_faltas}</td>
                            <td className="p-2">
                                <button onClick={() => handleExcluir(relatorio._id!)} className="text-red-600">Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
