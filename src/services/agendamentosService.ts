import { api } from "./Api";
import type { Agendamento, AgendamentoForm } from "../types/agendamentos";

export async function listarAgendamentos(): Promise<Agendamento[]> {
    const response = await api.get<Agendamento[]>("/agendamentos");
    return response.data;
}

export async function buscarAgendamentoPorId(id: string): Promise<Agendamento> {
    const response = await api.get<Agendamento>(`/agendamentos/${id}`);
    return response.data;
}

export async function criarAgendamento(data: AgendamentoForm): Promise<Agendamento> {
    const response = await api.post<Agendamento>("/agendamentos", data);
    return response.data;
}

export async function atualizarAgendamento(id: string, data: AgendamentoForm): Promise<Agendamento> {
    const response = await api.put<Agendamento>(`/agendamentos/${id}`, data);
    return response.data;
}

export async function removerAgendamento(id: string): Promise<void> {
    await api.delete(`/agendamentos/${id}`);
}
