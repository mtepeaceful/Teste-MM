import { formatCityUf } from '../utils/city';

export function DestinationList({
  destinations,
  canReorder,
  draggingId,
  dragOverId,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onDrop,
  onEdit,
  onDelete,
}) {
  return (
    <div className="list">
      {destinations.map((destination, index) => (
        <article
          className={`item${draggingId === destination.id ? ' dragging' : ''}${dragOverId === destination.id ? ' drag-over' : ''}`}
          key={destination.id}
          draggable={canReorder}
          onDragStart={() => onDragStart(destination.id)}
          onDragEnter={() => onDragEnter(destination.id)}
          onDragOver={(event) => event.preventDefault()}
          onDragEnd={onDragEnd}
          onDrop={() => onDrop(destination.id)}
        >
          {canReorder && (
            <div className="drag-handle" title="Arraste para reordenar">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  fill="currentColor"
                  d="M9 3h2v2H9V3zm0 4h2v2H9V7zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm4-16h2v2h-2V3zm0 4h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z"
                />
              </svg>
            </div>
          )}
          <div className="item-content">
            <p className="muted">#{index + 1}</p>
            <h3>{destination.city}</h3>
            <p className="muted">
              {formatCityUf(destination.label, destination.city)}
            </p>
          </div>
          <div className="actions">
            <button
              type="button"
              className="icon-button icon-edit"
              onClick={() => onEdit(destination)}
              title="Editar destino"
              aria-label={`Editar ${destination.city}`}
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  fill="currentColor"
                  d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.04a1.003 1.003 0 000-1.42l-2.5-2.5a1.003 1.003 0 00-1.42 0l-1.96 1.96 3.75 3.75 2.13-2.04z"
                />
              </svg>
            </button>
            <button
              type="button"
              className="icon-button icon-delete"
              onClick={() => onDelete(destination.id)}
              title="Excluir destino"
              aria-label={`Excluir ${destination.city}`}
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  fill="currentColor"
                  d="M9 3h6l1 2h4v2H4V5h4l1-2zm-2 6h2v9H7V9zm4 0h2v9h-2V9zm4 0h2v9h-2V9z"
                />
              </svg>
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
