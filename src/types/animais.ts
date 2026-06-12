export interface Animal {
    _id?: string;
    nome: string;
    especie: string;
    idade: number;
    porte: string;
    observacoes_saude?: string;
    preferencias_especificas?: string;
    clienteId?: string;
    cliente?: { _id: string; name: string };
}
