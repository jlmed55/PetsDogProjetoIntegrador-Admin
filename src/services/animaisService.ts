import { api } from "./Api";
import type { Animal } from "../types/animais";

export async function listarAnimais(): Promise<Animal[]> {
    const response = await api.get<Animal[]>("/animais");
    return response.data;
}

export async function criarAnimal(data: Animal): Promise<Animal> {
    const response = await api.post<Animal>("/animais", data);
    return response.data;
}

export async function atualizarAnimal(id: string, data: Animal): Promise<Animal> {
    const response = await api.put<Animal>(`/animais/${id}`, data);
    return response.data;
}

export async function removerAnimal(id: string): Promise<void> {
    await api.delete(`/animais/${id}`);
}
