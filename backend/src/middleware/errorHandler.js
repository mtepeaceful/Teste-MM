export function notFoundHandler(req, res) {
  res.status(404).json({ message: 'Rota nao encontrada.' });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    next(error);
    return;
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Erro interno do servidor.';

  if (statusCode >= 500) {
    console.error('[API] unexpected error', error);
  }

  res.status(statusCode).json({ message });
}
