import { api } from "./Api";
import type { Cliente } from "../types/clientes";

export async function listarClientes(): Promise<Cliente[]> {
    const response = await api.get<Cliente[]>("/clientes");
    return response.data;
}

export async function criarCliente(data: Cliente): Promise<Cliente> {
    const response = await api.post<Cliente>("/clientes", data);
    return response.data;
}

export async function atualizarCliente(id: string, data: Cliente): Promise<Cliente> {
    const response = await api.put<Cliente>(`/clientes/${id}`, data);
    return response.data;
}

export async function removerCliente(id: string): Promise<void> {
    await api.delete(`/clientes/${id}`);
}
