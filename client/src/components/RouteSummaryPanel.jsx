import { formatCityUf } from '../utils/city';
import { formatMinutes } from '../utils/format';

export function RouteSummaryPanel({ loading, routeSummary }) {
  if (loading) {
    return (
      <>
        <div className="loading-inline" role="status" aria-live="polite">
          <span className="spinner" aria-hidden="true" />
          <p className="muted">Calculando distancias da rota...</p>
        </div>
        <div className="list">
          {Array.from({ length: 2 }).map((_, index) => (
            <article className="item skeleton-item" key={`skeleton-${index}`}>
              <div className="skeleton-block">
                <span className="skeleton-line long" />
                <span className="skeleton-line short" />
              </div>
              <div className="skeleton-block align-right">
                <span className="skeleton-line short" />
                <span className="skeleton-line short" />
              </div>
            </article>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <p>
        <strong>Distância total:</strong>{' '}
        {routeSummary.totalDistanceKm.toFixed(2)} km
      </p>
      <p>
        <strong>Tempo total:</strong>{' '}
        {formatMinutes(routeSummary.totalDurationMin)}
      </p>
      {routeSummary.legs.length === 0 ? (
        <p>
          Adicione pelo menos dois destinos para calcular a viagem completa.
        </p>
      ) : null}
      <div className="list">
        {routeSummary.legs.map((leg) => (
          <article className="item" key={`${leg.fromId}-${leg.toId}`}>
            <div>
              <h3>{formatCityUf(leg.fromLabel)}</h3>
              <p className="muted">para {formatCityUf(leg.toLabel)}</p>
            </div>
            <div className="metrics">
              <span>{leg.distanceKm} km</span>
              <span>{formatMinutes(leg.durationMin)}</span>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
