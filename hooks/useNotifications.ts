import { useEffect, useState } from "react";

const URL_BASE = "https://prime-api-iawe.onrender.com";

export function useNotifications(matricula: string) {
    const [loading, setLoading] = useState(true);
    const [notificaciones, setNotificaciones] = useState([]);

    const fetchNotis = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${URL_BASE}/notifications?matricula=${matricula}`);
            const data = await res.json();
            setNotificaciones(data);
        } catch (err) {
            console.log("❌ Error cargando notificaciones:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (matricula) fetchNotis();
    }, [matricula]);

    return { notificaciones, loading, fetchNotis };
}

export async function marcarComoLeida(id: string) {
    try {
        await fetch(`${URL_BASE}/readNotification`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
    } catch (err) {
        console.log("❌ Error marcando como leída:", err);
    }
}