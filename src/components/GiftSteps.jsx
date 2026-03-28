export function GiftSteps({
  selectedBudget,
  onSelectBudget,
  profileSelector,
  results,
}) {
  return (
    <section className="nw-steps-layout">
      <section className="nw-filters-block">
        <section className="nw-step nw-filters-step mt-2 sm:mt-3">
          <header className="nw-filters-block__header nw-step__header">
            <span className="nw-filters-block__eyebrow nw-step__badge">Paso 1: Rangos de precio</span>
            <h2 className="nw-step__title">💸 ¿Cuánto quieres gastar?</h2>
          </header>

          <div className="nw-filters-grid nw-budget-buttons">
            <button type="button" onClick={() => onSelectBudget('all')} className={selectedBudget === 'all' ? 'nw-filter-card nw-filter-card--active' : 'nw-filter-card'}>
              <span className="nw-filter-card__label">Todos</span>
            </button>

            <button type="button" onClick={() => onSelectBudget('low')} className={selectedBudget === 'low' ? 'nw-filter-card nw-filter-card--active' : 'nw-filter-card'}>
              <span className="nw-filter-card__label">Hasta 15 €</span>
              <span className="nw-filter-card__hint">Detalle con encanto</span>
            </button>

            <button type="button" onClick={() => onSelectBudget('mid')} className={selectedBudget === 'mid' ? 'nw-filter-card nw-filter-card--active' : 'nw-filter-card'}>
              <span className="nw-filter-card__label">15–35 €</span>
              <span className="nw-filter-card__hint">Quedas muy bien</span>
            </button>

            <button type="button" onClick={() => onSelectBudget('high')} className={selectedBudget === 'high' ? 'nw-filter-card nw-filter-card--active' : 'nw-filter-card'}>
              <span className="nw-filter-card__label">35–70 €</span>
              <span className="nw-filter-card__hint">Regalo potente</span>
            </button>

            <button type="button" onClick={() => onSelectBudget('wow')} className={selectedBudget === 'wow' ? 'nw-filter-card nw-filter-card--active' : 'nw-filter-card'}>
              <span className="nw-filter-card__label">70–150 €</span>
              <span className="nw-filter-card__hint">El que se recuerda</span>
            </button>
          </div>
        </section>

        <section className="nw-step nw-filters-step mt-4 sm:mt-5">
          <header className="nw-filters-block__header nw-step__header">
            <span className="nw-filters-block__eyebrow nw-step__badge">Paso 2: Perfiles y ocasiones</span>
            <h2 className="nw-step__title">🎯 ¿Para quién es el regalo?</h2>
          </header>
          {profileSelector}
        </section>
      </section>

      {results}
    </section>
  );
}
