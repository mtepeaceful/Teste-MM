import { useState } from 'react';
import {
  createDestination,
  deleteDestination,
  updateDestination,
} from './api/travelApi';
import { DestinationList } from './components/DestinationList';
import { DestinationForm } from './components/DestinationForm';
import { RouteSummaryPanel } from './components/RouteSummaryPanel';
import { useDestinationData } from './hooks/useDestinationData';
import { useDestinationForm } from './hooks/useDestinationForm';
import { usePlacesAutocomplete } from './hooks/usePlacesAutocomplete';
import { MIN_AUTOCOMPLETE_LENGTH } from './constants/places';

function App() {
  const googleApiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim();
  const {
    destinations,
    routeSummary,
    loading,
    error,
    setError,
    reloadData,
    draggingId,
    dragOverId,
    canReorder,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
    handleDrop,
  } = useDestinationData();

  const {
    form,
    editingId,
    selectedPlaceId,
    handleCityChange: updateCity,
    handleSuggestionPick,
    startEditing,
    cancelEditing,
    buildPayload,
  } = useDestinationForm();

  const {
    suggestions,
    searchingSuggestions,
    placesStatus,
    placesErrorMessage,
    setPlacesErrorMessage,
    clearSuggestions,
  } = usePlacesAutocomplete({ apiKey: googleApiKey, city: form.city });

  const [placeSelected, setPlaceSelected] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (form.city.trim().length < MIN_AUTOCOMPLETE_LENGTH) {
      setError(
        `Informe pelo menos ${MIN_AUTOCOMPLETE_LENGTH} caracteres para buscar um destino.`
      );
      return;
    }

    if (googleApiKey && placesStatus === 'error') {
      setError(
        'Places API nova indisponivel. Verifique chave, billing, API habilitada e referrer no Google Cloud.'
      );
      return;
    }

    if (placesStatus === 'ready' && !placeSelected) {
      setError(
        'Selecione um endereco sugerido pela Places API nova antes de salvar.'
      );
      return;
    }

    try {
      const payload = buildPayload();
      if (editingId) {
        await updateDestination(editingId, payload);
      } else {
        await createDestination(payload);
      }

      cancelEditing();
      setPlaceSelected(false);
      await reloadData();
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  async function handleDelete(id) {
    setError('');

    try {
      await deleteDestination(id);
      if (editingId === id) {
        cancelEditing();
        setPlaceSelected(false);
      }
      await reloadData();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  function handleEdit(destination) {
    startEditing(destination);
    const currentPlaceId = destination.placeId || '';
    clearSuggestions();
    setPlacesErrorMessage('');
    setPlaceSelected(placesStatus !== 'ready' || Boolean(currentPlaceId));
  }

  function handleCityChange(event) {
    updateCity(event);
    clearSuggestions();
    setPlacesErrorMessage('');
    if (placesStatus === 'ready') {
      setPlaceSelected(false);
    }
  }

  function handleCancel() {
    cancelEditing();
    clearSuggestions();
    setPlacesErrorMessage('');
    setPlaceSelected(false);
  }

  function handleSuggestionSelection(suggestion) {
    clearSuggestions();
    setPlacesErrorMessage('');
    handleSuggestionPick(suggestion);
    setPlaceSelected(true);
  }

  return (
    <main className="app">
      <header>
        <h1>Planejador de Rota</h1>
        <p>CRUD de destinos com reordenação e resumo total da viagem.</p>
      </header>

      {error ? <div className="alert">{error}</div> : null}

      <DestinationForm
        editingId={editingId}
        form={form}
        onChange={handleCityChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        suggestions={suggestions}
        searchingSuggestions={searchingSuggestions}
        placesStatus={placesStatus}
        placesErrorMessage={placesErrorMessage}
        placeSelected={placeSelected}
        selectedPlaceId={selectedPlaceId}
        onSuggestionSelect={handleSuggestionSelection}
        minAutocompleteLength={MIN_AUTOCOMPLETE_LENGTH}
      />

      <section className="card">
        <h2>Destinos cadastrados</h2>
        <p className="muted">Arraste e solte os itens para reordenar.</p>
        {loading ? <p>Carregando...</p> : null}
        {!loading && destinations.length === 0 ? (
          <p>Nenhum destino cadastrado ainda.</p>
        ) : null}
        <DestinationList
          destinations={destinations}
          canReorder={canReorder}
          draggingId={draggingId}
          dragOverId={dragOverId}
          onDragStart={handleDragStart}
          onDragEnter={handleDragEnter}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </section>

      <section className="card">
        <h2>Resumo da rota completa</h2>
        <RouteSummaryPanel loading={loading} routeSummary={routeSummary} />
      </section>
    </main>
  );
}

export default App;
