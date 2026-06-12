import { api } from "./Api";
import type { Servico } from "../types/servicos";

export async function listarServicos(): Promise<Servico[]> {
    const response = await api.get<Servico[]>("/servicos");
    return response.data;
}

export async function buscarServicoPorId(id: string): Promise<Servico> {
    const response = await api.get<Servico>(`/servicos/${id}`);
    return response.data;
}

export async function criarServico(data: Servico): Promise<Servico> {
    const response = await api.post<Servico>("/servicos", data);
    return response.data;
}

export async function atualizarServico(id: string, data: Servico): Promise<Servico> {
    const response = await api.put<Servico>(`/servicos/${id}`, data);
    return response.data;
}

export async function removerServico(id: string): Promise<void> {
    await api.delete(`/servicos/${id}`);
}
