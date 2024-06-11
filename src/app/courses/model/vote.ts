export interface Vote {
    _idVote: string;
    courseId: string;
    type: string; // Pode ser "LIKE" ou "DISLIKE", dependendo do tipo de voto
    creationDate: Date; // Data de criação do voto
    machine: string; // Endereço IP ou identificação da máquina que registrou o voto
  }
  