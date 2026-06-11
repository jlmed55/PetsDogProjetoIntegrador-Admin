export interface Agendamento {
    _id?: string;
    data_hora: string;
    status: string;
    observacoes?: string;
    cliente?: { _id: string; name: string };
    animal?: { _id: string; nome: string };
    profissional?: { _id: string; name: string };
    servico?: { _id: string; name: string };
}

export interface AgendamentoForm {
    data_hora: string;
    status: string;
    observacoes?: string;
    clienteId: string;
    animalId: string;
    profissionalId: string;
    servicoId: string;
}
