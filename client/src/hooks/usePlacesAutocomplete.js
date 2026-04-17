import { useEffect, useRef, useState } from 'react';
import {
  AUTOCOMPLETE_DEBOUNCE_MS,
  MIN_AUTOCOMPLETE_LENGTH,
  PLACES_AUTOCOMPLETE_URL,
} from '../constants/places';

async function fetchPlacesSuggestions({ apiKey, input, signal }) {
  const response = await fetch(PLACES_AUTOCOMPLETE_URL, {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask':
        'suggestions.placePrediction.placeId,suggestions.placePrediction.text.text',
    },
    body: JSON.stringify({
      input,
      languageCode: 'pt-BR',
      regionCode: 'BR',
    }),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const apiMessage = payload?.error?.message || payload?.message;
    throw new Error(
      apiMessage || `Falha ao buscar sugestoes (${response.status}).`
    );
  }

  return (payload?.suggestions || [])
    .map((item) => {
      const prediction = item?.placePrediction;
      const text = prediction?.text?.text?.trim();
      const placeId = prediction?.placeId;

      if (!text || !placeId) {
        return null;
      }

      return { placeId, text };
    })
    .filter(Boolean);
}

export function usePlacesAutocomplete({ apiKey, city }) {
  const [placesStatus, setPlacesStatus] = useState(
    apiKey ? 'ready' : 'disabled'
  );
  const [placesErrorMessage, setPlacesErrorMessage] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchingSuggestions, setSearchingSuggestions] = useState(false);
  const requestAbortRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const skipNextSearchRef = useRef(false);

  useEffect(() => {
    if (!apiKey) {
      setPlacesStatus('disabled');
      setPlacesErrorMessage('');
      setSuggestions([]);
      setSearchingSuggestions(false);

      if (requestAbortRef.current) {
        requestAbortRef.current.abort();
      }

      return;
    }

    setPlacesStatus('ready');
  }, [apiKey]);

  useEffect(() => {
    if (placesStatus !== 'ready') {
      return () => {};
    }

    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return () => {};
    }

    const normalizedInput = city.trim();
    if (normalizedInput.length < MIN_AUTOCOMPLETE_LENGTH) {
      setSuggestions([]);
      setSearchingSuggestions(false);
      setPlacesErrorMessage('');

      if (requestAbortRef.current) {
        requestAbortRef.current.abort();
      }

      return () => {};
    }

    if (requestAbortRef.current) {
      requestAbortRef.current.abort();
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const controller = new AbortController();
        requestAbortRef.current = controller;
        setSearchingSuggestions(true);
        setPlacesErrorMessage('');

        const nextSuggestions = await fetchPlacesSuggestions({
          apiKey,
          input: normalizedInput,
          signal: controller.signal,
        });

        setSuggestions(nextSuggestions);
      } catch (searchError) {
        if (searchError?.name === 'AbortError') {
          return;
        }

        setSuggestions([]);
        setPlacesStatus('error');
        setPlacesErrorMessage(
          searchError?.message ||
            'Falha ao buscar sugestoes na Places API nova.'
        );
      } finally {
        setSearchingSuggestions(false);
      }
    }, AUTOCOMPLETE_DEBOUNCE_MS);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [apiKey, city, placesStatus]);

  useEffect(() => {
    return () => {
      if (requestAbortRef.current) {
        requestAbortRef.current.abort();
      }

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  function handleSuggestionSelect(suggestion) {
    skipNextSearchRef.current = true;
    setSuggestions([]);
    setPlacesErrorMessage('');
    return suggestion;
  }

  function clearSuggestions() {
    setSuggestions([]);
  }

  return {
    suggestions,
    searchingSuggestions,
    placesStatus,
    placesErrorMessage,
    setPlacesErrorMessage,
    clearSuggestions,
    handleSuggestionSelect,
  };
}
