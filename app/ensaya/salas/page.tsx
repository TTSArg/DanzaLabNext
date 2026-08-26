import { supabase } from '@/lib/supabase'

export default async function SalasPage() {
  const { data: salas, error } = await supabase
    .from('salas')
    .select('*')
    .eq('activa', true)

  if (error) {
    return <p>Error al cargar las salas.</p>
  }

  return (
    <main>
      <h1>Salas de ensayo</h1>
      <ul>
        {salas?.map((sala) => (
          <li key={sala.id}>
            <h2>{sala.nombre}</h2>
            <p>{sala.zona} — ${sala.precio_hora}/hora</p>
          </li>
        ))}
      </ul>
    </main>
  )
}