export interface Animal {
    _id?: string;
    id_animal: number;
    nome: string;
    especie: string;
    idade: number;
    porte: string;
    observacoes_saude?: string;
    preferencias_especificas?: string;
    clienteId: string;
}
