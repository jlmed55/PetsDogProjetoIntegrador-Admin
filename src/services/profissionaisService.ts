import { api } from "./Api";
import type { Profissional } from "../types/profissionais";

export async function listarProfissionais(): Promise<Profissional[]> {
    const response = await api.get<Profissional[]>("/profissionais");
    return response.data;
}

export async function buscarProfissionalPorId(id: string): Promise<Profissional> {
    const response = await api.get<Profissional>(`/profissionais/${id}`);
    return response.data;
}

export async function criarProfissional(data: Profissional): Promise<Profissional> {
    const response = await api.post<Profissional>("/profissionais", data);
    return response.data;
}

export async function atualizarProfissional(id: string, data: Profissional): Promise<Profissional> {
    const response = await api.put<Profissional>(`/profissionais/${id}`, data);
    return response.data;
}

export async function removerProfissional(id: string): Promise<void> {
    await api.delete(`/profissionais/${id}`);
}
