# Teste-MM

Projeto planejador de rotas simples com backend em Node.js (Express) e frontend em React (Vite).

## Como rodar (dev)

- Node.js 18+ (recomendado Node.js 20)
- npm

### 1) Instalar dependencias

```bash
cd backend
npm install

cd ../client
npm install
```

### 2) (Opcional) Arquivo de ambiente do client

Crie/edite `client/.env.local` com:

```bash
VITE_API_BASE_URL=/api
```

### 3) Rodar o backend

Em um terminal:

```bash
cd backend
npm run dev
```

Backend: `http://localhost:3000`

### 4) Rodar o frontend

Em outro terminal:

```bash
cd client
npm run dev
```

Frontend: `http://localhost:5173`

## Arquitetura

O projeto segue uma separacao simples por responsabilidades:

- Backend: `routes` recebem as requisicoes, `controllers` organizam os dados da entrada, `services` concentram as regras de negocio, `repositories` cuidam do armazenamento local e `adapters` fazem chamadas externas, como geocodificacao e rotas.
- Frontend: `components` montam a interface, `hooks` concentram estado e logica reutilizavel, e `api` faz a comunicacao com o backend.
- Durante o desenvolvimento, o Vite usa proxy em `/api` para encaminhar as chamadas para o backend em `http://localhost:3000`.

## Tecnologias e por que

- Node.js + Express no backend: permitem criar a API de forma simples e leve.
- React no frontend: facilita montar a interface em componentes reutilizaveis.
- Vite: deixa o front rapido para desenvolver e testar localmente.
- Nominatim/OpenStreetMap: usado para transformar endereco em coordenadas.
- NeDB: banco local simples para persistir os destinos sem precisar de um banco externo.
- ESLint: ajuda a manter o codigo mais consistente e a evitar erros comuns.
- Prettier: padroniza a formatacao do codigo.

## Pronto

Com os dois servidores rodando, abra o frontend no navegador e use a aplicacao normalmente.
