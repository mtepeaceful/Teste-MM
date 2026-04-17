import { useEffect, useState } from 'react';
import {
  fetchDestinations,
  fetchRouteSummary,
  reorderDestinations as reorderDestinationsRequest,
} from '../api/travelApi';

export function useDestinationData() {
  const [destinations, setDestinations] = useState([]);
  const [routeSummary, setRouteSummary] = useState({
    legs: [],
    totalDistanceKm: 0,
    totalDurationMin: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  async function loadData() {
    setLoading(true);
    setError('');

    try {
      const [destinationList, summary] = await Promise.all([
        fetchDestinations(),
        fetchRouteSummary(),
      ]);
      setDestinations(destinationList);
      setRouteSummary(summary);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleDragStart(id) {
    setDraggingId(id);
  }

  function handleDragEnter(id) {
    if (id !== draggingId) {
      setDragOverId(id);
    }
  }

  function handleDragEnd() {
    setDraggingId(null);
    setDragOverId(null);
  }

  function buildReorderedIds(sourceId, targetId) {
    const orderedIds = destinations.map((item) => item.id);
    const sourceIndex = orderedIds.indexOf(sourceId);
    const targetIndex = orderedIds.indexOf(targetId);

    if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
      return null;
    }

    const nextOrderedIds = [...orderedIds];
    const [movedId] = nextOrderedIds.splice(sourceIndex, 1);
    nextOrderedIds.splice(targetIndex, 0, movedId);
    return nextOrderedIds;
  }

  async function handleDrop(targetId) {
    if (!draggingId) {
      return;
    }

    const nextOrderedIds = buildReorderedIds(draggingId, targetId);
    setDraggingId(null);
    setDragOverId(null);

    if (!nextOrderedIds) {
      return;
    }

    try {
      await reorderDestinationsRequest(nextOrderedIds);
      await loadData();
    } catch (reorderError) {
      setError(reorderError.message);
    }
  }

  return {
    destinations,
    routeSummary,
    loading,
    error,
    setError,
    reloadData: loadData,
    draggingId,
    dragOverId,
    canReorder: destinations.length > 1,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
    handleDrop,
  };
}
