export function DestinationForm({
  editingId,
  form,
  onChange,
  onSubmit,
  onCancel,
  suggestions,
  searchingSuggestions,
  placesStatus,
  placesErrorMessage,
  placeSelected,
  selectedPlaceId,
  onSuggestionSelect,
  minAutocompleteLength,
}) {
  return (
    <section className="card">
      <h2>{editingId ? 'Editar destino' : 'Adicionar destino'}</h2>
      <form className="form" onSubmit={onSubmit}>
        <div className="autocomplete">
          <input
            value={form.city}
            onChange={onChange}
            placeholder="Cidade ou endereço"
            required
          />
          {placesStatus === 'ready' && suggestions.length > 0 ? (
            <ul
              className="suggestions"
              role="listbox"
              aria-label="Sugestoes de lugares"
            >
              {suggestions.map((suggestion) => (
                <li key={suggestion.placeId}>
                  <button
                    type="button"
                    className="suggestion-button"
                    onClick={() => onSuggestionSelect(suggestion)}
                  >
                    {suggestion.text}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {placesStatus === 'ready' ? (
          <p className="muted">Digite e selecione uma sugestao.</p>
        ) : null}
        {placesStatus === 'ready' && searchingSuggestions ? (
          <p className="muted">Buscando sugestoes...</p>
        ) : null}
        {placesStatus === 'error' ? (
          <>
            <p className="muted text-danger">Places API nova indisponivel.</p>
            {placesErrorMessage ? (
              <p className="muted text-danger">Detalhe: {placesErrorMessage}</p>
            ) : null}
          </>
        ) : null}
        {placesStatus === 'disabled' ? (
          <p className="muted">
            Defina VITE_GOOGLE_MAPS_API_KEY para habilitar busca inteligente com
            Places API nova.
          </p>
        ) : null}
        {placesStatus === 'ready' && placeSelected && selectedPlaceId ? (
          <p className="muted">Destino validado. Place ID: {selectedPlaceId}</p>
        ) : null}
        {placesStatus === 'ready' &&
        !placeSelected &&
        form.city.trim().length >= minAutocompleteLength ? (
          <p className="muted text-danger">
            Escolha uma sugestao para validar o endereco antes de salvar.
          </p>
        ) : null}
        <div className="actions">
          <button type="submit">{editingId ? 'Salvar' : 'Adicionar'}</button>
          {editingId ? (
            <button
              type="button"
              className="button-secondary"
              onClick={onCancel}
            >
              Cancelar
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}
