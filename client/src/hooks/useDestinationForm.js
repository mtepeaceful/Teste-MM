import { useState } from 'react';

const emptyForm = { city: '' };

export function useDestinationForm() {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState('');

  function resetDestinationSelection() {
    setSelectedPlaceId('');
  }

  function handleCityChange(event) {
    const nextValue = event.target.value;
    setForm({ city: nextValue });
    setSelectedPlaceId('');
  }

  function handleSuggestionPick(suggestion) {
    setForm({ city: suggestion.text });
    setSelectedPlaceId(suggestion.placeId);
  }

  function startEditing(destination) {
    setEditingId(destination.id);
    setForm({ city: destination.city });

    const currentPlaceId = destination.placeId || '';
    setSelectedPlaceId(currentPlaceId);
  }

  function cancelEditing() {
    setEditingId(null);
    setForm(emptyForm);
    resetDestinationSelection();
  }

  function buildPayload() {
    return {
      city: form.city.trim(),
      placeId: selectedPlaceId || undefined,
    };
  }

  return {
    form,
    editingId,
    selectedPlaceId,
    setForm,
    setEditingId,
    handleCityChange,
    handleSuggestionPick,
    startEditing,
    cancelEditing,
    resetDestinationSelection,
    buildPayload,
  };
}
