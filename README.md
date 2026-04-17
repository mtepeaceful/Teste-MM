# test-mm

Projeto simples com backend em Node.js (Express) e frontend em React (Vite).

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

## Pronto

Com os dois servidores rodando, abra o frontend no navegador e use a aplicacao normalmente.
