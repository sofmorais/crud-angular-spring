import { Vote } from "./vote";

export interface Course {
  _id: string;
  name: string;
  category: string;
  description: string;
  status: string;
  likes: number; // Adicionar a contagem de likes
  dislikes: number; // Adicionar a contagem de dislikes
  votes: Vote[]; // Adicionar uma lista de votos
}
