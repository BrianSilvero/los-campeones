// ===== Reseñas de Google (función de Vercel) =====
// Consulta la ficha del local en Google Places y la guarda en caché 24 h,
// así la página muestra siempre la puntuación y las reseñas actualizadas.
// Requiere la variable de entorno GOOGLE_PLACES_API_KEY en Vercel (ver RESENAS.md).

const PLACE_ID = process.env.GOOGLE_PLACE_ID || "ChIJc8k1qEvLvJURZSafu2EXv4U";

module.exports = async (req, res) => {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) {
    res.status(503).json({ ok: false, error: "Falta GOOGLE_PLACES_API_KEY" });
    return;
  }
  const lang = ["es", "en", "pt"].includes(req.query.lang) ? req.query.lang : "es";
  try {
    const r = await fetch(`https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=${lang}`, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "rating,userRatingCount,reviews,googleMapsUri",
      },
    });
    if (!r.ok) throw new Error("Google respondió " + r.status);
    const d = await r.json();
    const reviews = (d.reviews || [])
      .filter((v) => v.text?.text || v.originalText?.text)
      .map((v) => ({
        author: v.authorAttribution?.displayName || "Cliente de Google",
        authorUrl: v.authorAttribution?.uri || null,
        photo: v.authorAttribution?.photoUri || null,
        rating: v.rating || 0,
        when: v.relativePublishTimeDescription || "",
        publishTime: v.publishTime || null,
        text: (v.text?.text || v.originalText?.text || "").trim(),
      }));
    // Caché en el borde de Vercel: 1 día, y sirve la copia vieja mientras actualiza
    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
    res.status(200).json({
      ok: true,
      rating: d.rating || null,
      total: d.userRatingCount || 0,
      mapsUrl: d.googleMapsUri || null,
      reviews,
      updated: new Date().toISOString(),
    });
  } catch (e) {
    res.status(502).json({ ok: false, error: String(e.message || e) });
  }
};
