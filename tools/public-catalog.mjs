/* =========================================================
   MUSEO · Catálogo público
   ---------------------------------------------------------
   data/cars.json lleva TODO el catálogo, borradores incluidos.
   A producción (dist/) sólo sale lo que ya se puede ver:
     · "open"       sala inaugurada (sin fecha, o con la fecha ya pasada);
     · "scheduled"  sala con apertura programada dentro de los próximos
                    WINDOW_DAYS días (su cuenta atrás ya es pública);
     · "teaser"     sala en desarrollo ANUNCIADA a propósito en el Hall:
                    "status": "coming_soon" + "announce": true.
   Se queda fuera ("hidden"):
     · cualquier "coming_soon" sin "announce": true (borrador);
     · una sala con apertura programada a más de WINDOW_DAYS días.
   Lo usa tools/build-dist.mjs. En local (servidor de desarrollo) se
   sirve data/cars.json entero, así que se sigue viendo todo.

   Ojo: una sala "scheduled" viaja completa en el JSON publicado (su
   apertura automática depende de ello); la pantalla de bloqueo es
   presentación, no un control de acceso.
   ========================================================= */
export const WINDOW_DAYS = 14;
const pad2 = (n) => String(n).padStart(2, "0");

export function visibility(car, now = Date.now()) {
  if (car.status === "coming_soon") return car.announce === true ? "teaser" : "hidden";
  const t = car.releaseDate ? Date.parse(car.releaseDate) : NaN;
  if (t > now) return t - now <= WINDOW_DAYS * 86400000 ? "scheduled" : "hidden";
  return "open";
}

/* Devuelve { data, hidden }: el catálogo sin las salas ocultas y la lista de las que se han quitado.
   El número de sala sale de la posición en el catálogo completo: si al quitar un borrador cambiaría,
   se fija en "room" para que la numeración pública no se mueva. */
export function publicCatalog(full, now = Date.now()) {
  const hidden = [];
  const cars = [];
  full.cars.forEach((car, i) => {
    if (visibility(car, now) === "hidden") { hidden.push(car); return; }
    const room = car.room || pad2(i + 1);
    cars.push(car.room || room === pad2(cars.length + 1) ? car : { ...car, room });
  });
  return { data: { ...full, cars }, hidden };
}
