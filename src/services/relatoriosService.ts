import { api } from "./Api";
import type { Relatorio } from "../types/relatorios";

export async function listarRelatorios(): Promise<Relatorio[]> {
    const response = await api.get<Relatorio[]>("/relatorios");
    return response.data;
}

export async function criarRelatorio(data: Relatorio): Promise<Relatorio> {
    const response = await api.post<Relatorio>("/relatorios", data);
    return response.data;
}

export async function removerRelatorio(id: string): Promise<void> {
    await api.delete(`/relatorios/${id}`);
}
