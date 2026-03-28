
export function ComoFuncionaPage() {
  return (
    <main className="nw-page nw-page--como-funciona">
      <header className="nw-page__header">
        <span className="nw-page__eyebrow">Guía rápida ✨</span>
        <h1>Encontrar regalo no debería ser un marrón</h1>
        <p className="nw-page__intro">
          NoWorries.gift está pensada para esos momentos de
          {" "}
          <span className="nw-emphasis-underline">“¿y ahora qué regalo?”</span>.
          {" "}
          Tú pones el presupuesto y para quién es; nosotros hacemos la parte pesada
          de buscar, filtrar y quedarnos con unas pocas ideas que tengan sentido.
        </p>
        <div className="nw-page__tags">
          <span className="nw-tag">💸 Menos tiempo perdido</span>
          <span className="nw-tag">🧠 Menos decisiones raras</span>
          <span className="nw-tag">🎁 Más ideas que encajan</span>
        </div>
      </header>

      <section className="nw-section">
        <h2>El típico drama de los regalos 😵‍💫</h2>
        <p>
          Encontrar regalo muchas veces es esto: entras en una tienda online,
          buscas algo tipo “regalo para mamá”, y acabas con 20 pestañas abiertas,
          mil productos iguales y cero decisión.
        </p>
        <p>
          Pierdes tiempo, te agobias y terminas comprando cualquier cosa a última
          hora
          {" "}
          <span className="nw-emphasis">“para salir del paso”.</span>
        </p>
        <p>
          NoWorries.gift existe justo para evitar ese momento. Es una web pensada
          para cuando
          {" "}
          <span className="nw-emphasis-underline">
            necesitas quedar bien sin pasarte la tarde buceando en catálogos infinitos
          </span>.
        </p>
      </section>

      <section className="nw-section">
        <h2>Cómo funciona, paso a paso</h2>

        {/* Paso 1 */}
        <article className="nw-step-block">
          <div className="nw-step-block__header">
            <span className="nw-step-block__badge">Paso 1</span>
            <h3>Elige cuánto quieres gastar 💸</h3>
          </div>
          <p>
            Primero eliges un rango de precio:
            {" "}
            <strong>“Hasta 15 € · Detalle con encanto”</strong>,
            {" "}
            <strong>“15–35 € · Quedas muy bien”</strong>,
            {" "}
            <strong>“35–70 € · Regalo potente”</strong>
            {" "}
            o
            {" "}
            <strong>“70–150 € · El que se recuerda”</strong>.
          </p>
          <p>
            <span className="nw-emphasis">
              No hace falta que sea exacto;
            </span>
            {" "}
            es solo para que te enseñemos ideas que encajen con lo que tienes en
            mente y no pierdas tiempo viendo cosas fuera de rango.
          </p>
        </article>

        {/* Paso 2 */}
        <article className="nw-step-block">
          <div className="nw-step-block__header">
            <span className="nw-step-block__badge">Paso 2</span>
            <h3>Cuenta para quién es 🎯</h3>
          </div>
          <p>
            Después eliges para quién es el regalo.
          </p>
          <p>
            Puedes ir a <strong>“Personas”</strong> (mamá, papá, pareja,
            mejor amigo/a, compañero/a de trabajo, abuelos, niños, “para
            cualquiera”…), a <strong>“Características”</strong> (“para quien lo
            tiene todo”, “muy casero/a”, “muy techie”, minimalista, eco /
            sostenible, friki de algo, viajero/a…), o a <strong>“Ocasiones”</strong>
            {" "}
            (cumpleaños, aniversario, Día de la Madre o del Padre, Navidad / Reyes,
            amigo invisible, final de curso, “solo porque sí”…).
          </p>
          <p>
            Solo tienes que pulsar en el chip que mejor describa a esa persona o al
            momento:
            {" "}
            <span className="nw-emphasis-pill">
              nada de menús raros ni filtros complicados.
            </span>
          </p>
        </article>

        {/* Paso 3 */}
        <article className="nw-step-block">
          <div className="nw-step-block__header">
            <span className="nw-step-block__badge">Paso 3</span>
            <h3>Te damos pocas ideas, pero buenas 🎁</h3>
          </div>
          <p>
            Con tu presupuesto y tu perfil, te mostramos primero unas cuantas ideas
            más seguras y luego más opciones por si quieres comparar un poco sin
            perderte.
          </p>
          <p>
            En cada tarjeta verás:
          </p>
          <ul className="nw-list">
            <li>Un resumen rápido del regalo.</li>
            <li>
              Un botón <strong>“Ver por qué puede encajar”</strong>, donde te
              contamos en sencillo por qué puede funcionar para ese tipo de
              persona.
            </li>
            <li>
              Y, si te encaja, un botón <strong>“Ver en Amazon”</strong> para ver
              más fotos, opiniones y comprarlo si quieres.
            </li>
          </ul>
        </article>
      </section>

      <section className="nw-section">
        <h2>Qué hace diferente a NoWorries.gift ✨</h2>
        <ul className="nw-list">
          <li>
            Nos centramos en pocas ideas, no en todo lo que existe.
            {" "}
            <span className="nw-emphasis-pill">Menos ruido, más claridad.</span>
          </li>
          <li>
            Priorizamos productos que tengan utilidad real: cosas que se usan de
            verdad, no solo “queda mono en la foto”.
          </li>
          <li>
            Miramos valoraciones, comentarios y sentido común, no solo el precio.
          </li>
          <li>
            El objetivo no es que te pases la tarde comparando fichas, sino que
            puedas decir:
            {" "}
            <span className="nw-emphasis">“Vale, este. Listo”.</span>
          </li>
        </ul>
        <p>
          Queremos ser esa web que abres cuando te toca regalar y
          {" "}
          <span className="nw-emphasis-underline">
            no quieres perder media hora navegando sin rumbo.
          </span>
        </p>
      </section>

      <section className="nw-section nw-section--disclaimer">
        <h2>Sobre los enlaces a Amazon 💬</h2>
        <p>
          La mayoría de ideas que ves aquí llevan a productos de Amazon. No porque
          Amazon sea perfecto, sino porque mucha gente ya tiene cuenta, sabe
          comprar allí sin complicaciones y suelen entregar rápido (ideal para
          regalos de última hora).
        </p>
        <p>
          Algunos de esos enlaces son de afiliado. Esto significa que, si haces
          clic en un enlace y acabas comprando en Amazon, NoWorries.gift puede
          recibir una pequeña comisión.
        </p>
        <p>
          Tú pagas exactamente lo mismo que si hubieras ido directo a Amazon, sin
          ningún recargo, y esa pequeña comisión nos ayuda a mantener la web,
          seguir revisando ideas y mejorar la selección.
        </p>
        <p>
          No elegimos productos “porque den más comisión”.
          {" "}
          <span className="nw-emphasis">
            Elegimos ideas que tengan sentido como regalo y que te ahorren tiempo
          </span>
          , aunque eso signifique enseñar menos opciones.
        </p>
        <p>
          Y si lo prefieres, puedes usar NoWorries.gift solo para inspirarte y
          luego buscar tú el producto por tu cuenta.
        </p>
      </section>

      <section className="nw-section nw-section--summary">
        <h2>En resumen 🧠 + 🎁 = 🙂</h2>
        <p>
          Si quieres ir directo al grano: eliges cuánto quieres gastar, para quién
          es, y te damos unas cuantas ideas
          {" "}
          <span className="nw-emphasis">que no dan vergüenza regalar</span>.
        </p>
        <p>
          Si prefieres mirar con calma, puedes explorar por perfiles,
          características u ocasiones y guardar la página para futuras emergencias
          regaliles.
        </p>
        <p>
          Y si alguna vez echas de menos un tipo de regalo o perfil concreto, nos
          encantará saberlo para ir ajustando la web justo a lo que la gente
          necesita.
        </p>
      </section>
    </main>
  );
}

export default ComoFuncionaPage;
