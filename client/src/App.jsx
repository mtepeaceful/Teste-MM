import { useEffect, useState } from 'react'
import {
  createDestination,
  deleteDestination,
  fetchDestinations,
  fetchRouteLeg,
  fetchRouteSummary,
  reorderDestinations,
  updateDestination
} from './api/travelApi'
import { formatMinutes } from './utils/format'

const emptyForm = { city: '' }

function App() {
  const [destinations, setDestinations] = useState([])
  const [routeSummary, setRouteSummary] = useState({ legs: [], totalDistanceKm: 0, totalDurationMin: 0 })
  const [pairRoute, setPairRoute] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [routeForm, setRouteForm] = useState({ from: '', to: '' })

  async function loadData() {
    console.log('[UI] loading destinations and route summary')
    setLoading(true)
    setError('')

    try {
      const [destinationList, summary] = await Promise.all([
        fetchDestinations(),
        fetchRouteSummary()
      ])
      setDestinations(destinationList)
      setRouteSummary(summary)
      console.log('[UI] data loaded', { destinations: destinationList.length, legs: summary.legs.length })

      if (!routeForm.from && destinationList.length > 0) {
        setRouteForm({ from: destinationList[0].id, to: destinationList[1]?.id || destinationList[0].id })
      }
    } catch (fetchError) {
      setError(fetchError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    console.log('[UI] submit destination', { editingId, city: form.city })

    try {
      if (editingId) {
        await updateDestination(editingId, form)
      } else {
        await createDestination(form)
      }

      setForm(emptyForm)
      setEditingId(null)
      await loadData()
      console.log('[UI] destination saved')
    } catch (submitError) {
      setError(submitError.message)
      console.error('[UI] failed to save destination', submitError)
    }
  }

  function handleEdit(destination) {
    console.log('[UI] editing destination', destination.id)
    setEditingId(destination.id)
    setForm({ city: destination.city })
  }

  async function handleDelete(id) {
    setError('')
    console.log('[UI] delete destination', id)

    try {
      await deleteDestination(id)
      if (editingId === id) {
        setEditingId(null)
        setForm(emptyForm)
      }
      await loadData()
      console.log('[UI] destination deleted', id)
    } catch (deleteError) {
      setError(deleteError.message)
      console.error('[UI] failed to delete destination', deleteError)
    }
  }

  async function moveDestination(index, direction) {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= destinations.length) {
      return
    }

    const reordered = [...destinations]
    const [current] = reordered.splice(index, 1)
    reordered.splice(nextIndex, 0, current)

    console.log('[UI] reorder destination', reordered.map((item) => item.id))

    try {
      await reorderDestinations(reordered.map((item) => item.id))
      await loadData()
      console.log('[UI] destinations reordered')
    } catch (reorderError) {
      setError(reorderError.message)
      console.error('[UI] failed to reorder destinations', reorderError)
    }
  }

  async function handleRouteLookup(event) {
    event.preventDefault()
    setError('')

    console.log('[UI] route lookup', routeForm)

    try {
      const result = await fetchRouteLeg(routeForm.from, routeForm.to)
      setPairRoute(result)
      console.log('[UI] route lookup result', result)
    } catch (lookupError) {
      setError(lookupError.message)
      console.error('[UI] failed route lookup', lookupError)
    }
  }

  const canReorder = destinations.length > 1
  const routeDisabled = destinations.length < 2 || !routeForm.from || !routeForm.to

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Labs Travel Planner</p>
          <h1>Planejamento de rota com CRUD, ordem e cálculo real de viagem.</h1>
          <p className="lead">
            Cadastre destinos, reorganize a sequência da viagem, remova pontos quando quiser e confira a distância e o tempo entre cada parada usando uma API pública.
          </p>
        </div>

        <div className="stats-grid">
          <article>
            <span>Destinos</span>
            <strong>{destinations.length}</strong>
          </article>
          <article>
            <span>Distância total</span>
            <strong>{routeSummary.totalDistanceKm.toFixed(2)} km</strong>
          </article>
          <article>
            <span>Tempo total</span>
            <strong>{formatMinutes(routeSummary.totalDurationMin)}</strong>
          </article>
        </div>
      </section>

      {error ? <div className="alert">{error}</div> : null}

      <section className="panel-grid">
        <article className="panel">
          <h2>{editingId ? 'Editar destino' : 'Adicionar destino'}</h2>
          <form className="stack" onSubmit={handleSubmit}>
            <label>
              Cidade ou endereço
              <input
                value={form.city}
                onChange={(event) => setForm({ city: event.target.value })}
                placeholder="Ex.: Belo Horizonte, MG"
                required
              />
            </label>
            <div className="row-actions">
              <button className="primary" type="submit">
                {editingId ? 'Salvar alterações' : 'Adicionar destino'}
              </button>
              {editingId ? (
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    setEditingId(null)
                    setForm(emptyForm)
                  }}
                >
                  Cancelar
                </button>
              ) : null}
            </div>
          </form>
        </article>

        <article className="panel">
          <h2>Consultor entre dois destinos</h2>
          <form className="stack" onSubmit={handleRouteLookup}>
            <div className="split">
              <label>
                Origem
                <select
                  value={routeForm.from}
                  onChange={(event) => setRouteForm((current) => ({ ...current, from: event.target.value }))}
                  disabled={routeDisabled}
                >
                  {destinations.map((destination) => (
                    <option key={destination.id} value={destination.id}>
                      {destination.city}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Destino
                <select
                  value={routeForm.to}
                  onChange={(event) => setRouteForm((current) => ({ ...current, to: event.target.value }))}
                  disabled={routeDisabled}
                >
                  {destinations.map((destination) => (
                    <option key={destination.id} value={destination.id}>
                      {destination.city}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button className="primary" type="submit" disabled={routeDisabled}>
              Ver distância e tempo
            </button>
          </form>
          {pairRoute ? (
            <div className="route-card">
              <strong>{pairRoute.fromLabel} → {pairRoute.toLabel}</strong>
              <p>{pairRoute.distanceKm} km</p>
              <p>{formatMinutes(pairRoute.durationMin)}</p>
            </div>
          ) : null}
        </article>
      </section>

      <section className="panel">
        <h2>Destinos cadastrados</h2>
        {loading ? <p>Carregando...</p> : null}
        {!loading && destinations.length === 0 ? <p>Nenhum destino cadastrado ainda.</p> : null}
        <div className="destination-list">
          {destinations.map((destination, index) => (
            <article className="destination-item" key={destination.id}>
              <div>
                <p className="destination-order">#{index + 1}</p>
                <h3>{destination.city}</h3>
                <p className="destination-subtitle">{destination.label}</p>
              </div>
              <div className="destination-actions">
                <button type="button" className="secondary" onClick={() => handleEdit(destination)}>
                  Editar
                </button>
                <button type="button" className="secondary" onClick={() => handleDelete(destination.id)}>
                  Excluir
                </button>
                <button
                  type="button"
                  className="ghost"
                  onClick={() => moveDestination(index, -1)}
                  disabled={!canReorder || index === 0}
                >
                  Para cima
                </button>
                <button
                  type="button"
                  className="ghost"
                  onClick={() => moveDestination(index, 1)}
                  disabled={!canReorder || index === destinations.length - 1}
                >
                  Para baixo
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Resumo da rota completa</h2>
        {routeSummary.legs.length === 0 ? <p>Adicione pelo menos dois destinos para calcular a viagem completa.</p> : null}
        <div className="destination-list">
          {routeSummary.legs.map((leg) => (
            <article className="destination-item" key={`${leg.fromId}-${leg.toId}`}>
              <div>
                <h3>{leg.fromLabel}</h3>
                <p className="destination-subtitle">para {leg.toLabel}</p>
              </div>
              <div className="destination-metrics">
                <span>{leg.distanceKm} km</span>
                <span>{formatMinutes(leg.durationMin)}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
