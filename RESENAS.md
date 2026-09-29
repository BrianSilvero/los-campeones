# Reseñas de Google en tiempo real

La página muestra la puntuación, la cantidad de reseñas y las 5 reseñas que Google
considera más relevantes (Google no entrega más de 5 por consulta). Se actualiza
sola una vez por día.

Mientras no esté configurada la clave, la sección muestra solo los botones
**"Dejanos tu reseña"** y **"Ver todas en Google"** (no se muestra nada inventado).

## Cómo activarla (una sola vez, ~10 minutos)

1. Entrá a https://console.cloud.google.com con la cuenta de Google del local.
2. Creá un proyecto (por ejemplo "Los Campeones Web").
3. Menú ☰ → **APIs y servicios → Biblioteca** → buscá **"Places API (New)"** → **Habilitar**.
   (Pide cargar una tarjeta: Google da crédito gratis mensual; con 1 consulta por día el uso es mínimo.)
4. **APIs y servicios → Credenciales → Crear credenciales → Clave de API**. Copiala.
5. Recomendado: en la clave, **Restringir clave → Restricciones de API → Places API (New)**.
6. En **vercel.com** → tu proyecto → **Settings → Environment Variables**:
   - Name: `GOOGLE_PLACES_API_KEY`
   - Value: la clave que copiaste
   - Guardá y hacé **Redeploy** (Deployments → ⋯ → Redeploy).

Listo. Para probar: abrí `https://TU-DOMINIO/api/reviews` y tiene que mostrar los datos.

El ID de la ficha ya está configurado: `ChIJc8k1qEvLvJURZSafu2EXv4U`.
