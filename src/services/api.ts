import axios from 'axios';

export const api = axios.create({
  // URL que o Render vai gerar para o seu backend (exemplo)
  baseURL: 'https://persefone-backend.onrender.com', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});