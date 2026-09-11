import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { PageIntro } from '../../components/site'

export default async function SalasPage() {
  const { data: salas, error } = await supabase
    .from('salas')
    .select('*')
    .eq('activa', true)

  if (error) {
    return (
      <main className="page">
        <div className="inner">
          <PageIntro label="App Ensaya" title="Salas de ensayo" />
          <p className="status-message">No pudimos cargar las salas. Intentá nuevamente más tarde.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="inner">
        <PageIntro
          label="App Ensaya · Buenos Aires"
          title="Salas de ensayo"
          description="Encontrá el espacio adecuado para que tu práctica pueda ocurrir. Explorá salas activas por zona, precio y disponibilidad."
        />
        {salas?.length ? (
          <div className="sala-grid">
            {salas.map((sala) => (
              <article className="sala-card" key={sala.id}>
                {(sala.imagen_url || sala.foto_url || sala.image_url) && (
                  <img
                    src={sala.imagen_url || sala.foto_url || sala.image_url}
                    alt={sala.nombre}
                    className="sala-image"
                    loading="lazy"
                  />
                )}
                <div className="sala-content">
                  <div className="sala-label">Sala disponible</div>
                  <h3>{sala.nombre}</h3>
                  <p className="sala-location">{sala.zona}</p>
                  <div className="sala-footer">
                    <span><strong>${sala.precio_hora}</strong> / hora</span>
                    <Link href={`/ensaya/salas/${sala.id}`} className="btn-outline">Ver sala</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="status-message">Todavía no hay salas activas disponibles.</p>
        )}
      </div>
    </main>
  )
}