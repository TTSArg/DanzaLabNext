"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Profile = {
  role: "admin" | "cliente" | string;
};

type PendingRequest = {
  id: number;
  nombre_espacio: string;
  barrio: string | null;
  whatsapp: string;
  estado: string;
  tipo_servicio: string | null;
  capacidad: number | null;
  created_at: string;
};

const ADMIN_EMAILS = new Set([
  "ttservicios.arg@gmail.com",
  "admin@danzalab.com",
  "admin@danzalab.com",
  "hola@danzalab.com",
]);

function normalizeRole(value: unknown): "admin" | "cliente" | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === "admin") return "admin";
  if (normalized === "cliente" || normalized === "client" || normalized === "user") return "cliente";
  return null;
}

function formatSupabaseError(error: any) {
  if (!error) return "Error desconocido";
  return [error.message, error.details, error.hint, error.code].filter(Boolean).join(" · ");
}

function createSpaceSlug(name: string, id: number) {
  const normalizedName = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${normalizedName || "sala"}-${id}`;
}

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function loadProfile(userId: string | undefined) {
    if (!userId) {
      setProfile(null);
      return;
    }

    try {
      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("role, id, email")
        .eq("id", userId)
        .maybeSingle();

      if (!profileError && data) {
        const role = normalizeRole(data.role) ?? "cliente";
        setProfile({ role });
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData.session?.user;
      const directRole = normalizeRole(currentUser?.app_metadata?.role ?? currentUser?.user_metadata?.role);
      const email = currentUser?.email?.toLowerCase();

      if (directRole === "admin") {
        setProfile({ role: "admin" });
        return;
      }

      if (email && ADMIN_EMAILS.has(email)) {
        setProfile({ role: "admin" });
        return;
      }

      setProfile({ role: "cliente" });
    } catch (error) {
      console.error("loadProfile failed", error);
      setProfile({ role: "cliente" });
    }
  }

  async function loadPendingRequests() {
    const { data, error: requestsError } = await supabase
      .from("espacios_solicitudes")
      .select("id, nombre_espacio, barrio, whatsapp, estado, tipo_servicio, capacidad, created_at")
      .eq("estado", "pendiente")
      .order("created_at", { ascending: false });

    if (requestsError) {
      console.error(requestsError);
      return;
    }

    setRequests((data ?? []) as PendingRequest[]);
  }

  async function refreshAccess() {
    const { data: sessionData } = await supabase.auth.getSession();
    const currentSession = sessionData.session;
    setSession(currentSession);

    if (!currentSession?.user?.id) {
      setProfile(null);
      setLoading(false);
      return;
    }

    await loadProfile(currentSession.user.id);
    setLoading(false);
  }

  useEffect(() => {
    refreshAccess();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession?.user?.id) {
        setProfile(null);
        setLoading(false);
        return;
      }

      loadProfile(nextSession.user.id).finally(() => setLoading(false));
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (profile?.role === "admin") {
      loadPendingRequests();
    }
  }, [profile]);

  async function handleSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthLoading(true);
    setError(null);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setAuthLoading(false);
      return;
    }

    if (data.user?.id) {
      await loadProfile(data.user.id);
      setSession(data.session);
    }

    setAuthLoading(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setRequests([]);
  }

  async function approveRequest(requestId: number) {
    setError(null);

    const { data: requestData, error: requestError } = await supabase
      .from("espacios_solicitudes")
      .select("*")
      .eq("id", requestId)
      .single();

    if (requestError || !requestData) {
      console.error("No se pudo cargar la solicitud:", requestError);
      setError(`No se pudo cargar la solicitud: ${requestError?.message ?? "no encontrada"}`);
      return;
    }

    const spacePayload = {
      nombre: requestData.nombre_espacio,
      slug: createSpaceSlug(requestData.nombre_espacio, requestId),
      zona: requestData.barrio || "Otro",
      capacidad: requestData.capacidad ?? 8,
      disciplinas: requestData.disciplinas ?? [],
      caracteristicas: requestData.caracteristicas ?? [],
      precio_hora: requestData.precio_desde ?? null,
      whatsapp: requestData.whatsapp ?? "",
      imagen_url: String(requestData.imagen_url ?? "").trim() || null,
      activa: true,
    };

    const { error: insertError } = await supabase.from("salas").insert([spacePayload]);
    if (insertError) {
      const errorMessage = formatSupabaseError(insertError);
      console.error("No se pudo insertar la sala:", JSON.stringify(insertError, Object.getOwnPropertyNames(insertError)));
      setError(`No se pudo publicar la sala: ${errorMessage}`);
      return;
    }

    const { error: updateError } = await supabase
      .from("espacios_solicitudes")
      .update({ estado: "aprobado", updated_at: new Date().toISOString() })
      .eq("id", requestId);

    if (updateError) {
      const errorMessage = formatSupabaseError(updateError);
      console.error("No se pudo actualizar la solicitud:", JSON.stringify(updateError, Object.getOwnPropertyNames(updateError)));
      setError(`La sala se creó, pero no se pudo actualizar el estado: ${errorMessage}`);
      return;
    }

    try {
      const emailToSend = String(requestData.email ?? "").trim();
      if (emailToSend) {
        const response = await fetch("/api/approval-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: emailToSend,
            spaceName: requestData.nombre_espacio,
          }),
        });

        const responseData = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(responseData?.error || "No se pudo enviar el mail de notificación.");
        }
      }
    } catch (notificationError) {
      console.error("Approval email notification failed:", notificationError);
      setError("La sala quedó aprobada, pero no se pudo enviar el email de notificación.");
    }

    await loadPendingRequests();
  }

  async function rejectRequest(requestId: number) {
    const { error } = await supabase
      .from("espacios_solicitudes")
      .update({ estado: "rechazado", updated_at: new Date().toISOString() })
      .eq("id", requestId);

    if (!error) {
      await loadPendingRequests();
    }
  }

  if (loading) {
    return <main className="admin-shell"><div className="admin-card"><p>Cargando acceso administrativo...</p></div></main>;
  }

  if (!session) {
    return (
      <main className="admin-shell">
        <div className="admin-card admin-card--login">
          <div className="inner-label">Danza Lab · Administración</div>
          <h1>Ingresar</h1>
          <form onSubmit={handleSignIn} className="admin-form" autoComplete="off">
            <label>Email
              <input type="email" name="admin-login-email" autoComplete="off" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <label>Contraseña
              <input type="password" name="admin-login-password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </label>
            {error && <p className="admin-error">{error}</p>}
            <button className="btn" type="submit" disabled={authLoading}>
              {authLoading ? "Ingresando..." : "Entrar"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  if (profile?.role !== "admin") {
    return (
      <main className="admin-shell">
        <div className="admin-card">
          <div className="inner-label">Acceso restringido</div>
          <h1>Sin permisos</h1>
          <p>Este usuario no tiene permisos de administrador.</p>
          <button className="btn" onClick={handleSignOut}>Cerrar sesión</button>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <div className="admin-card admin-card--wide">
        <div className="admin-header">
          <div>
            <div className="inner-label">Ensaya · Admin</div>
            <h1>Solicitudes pendientes</h1>
          </div>
          <button className="btn-outline" onClick={handleSignOut}>Salir</button>
        </div>

        {error && <p className="admin-error">{error}</p>}

        {requests.length === 0 ? (
          <p className="status-message">No hay solicitudes pendientes para revisar.</p>
        ) : (
          <div className="admin-request-list">
            {requests.map((request) => (
              <article key={request.id} className="admin-request-item">
                <div>
                  <h3>{request.nombre_espacio}</h3>
                  <p>{request.barrio ?? "Sin barrio"} · {request.whatsapp}</p>
                  <p>{request.tipo_servicio ?? "Formación y práctica"} · {request.capacidad ?? 0} personas</p>
                </div>

                <div className="admin-request-actions">
                  <button className="btn" onClick={() => approveRequest(request.id)}>Aprobar</button>
                  <button className="btn-outline" onClick={() => rejectRequest(request.id)}>Rechazar</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
