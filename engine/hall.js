/* =========================================================
   MUSEO · HALL
   Carga data/cars.json, rellena el recuento de salas de la
   cabecera y el pie con el aviso legal, y avisa (museo:hall)
   para que engine/hall-orbit.js monte el showroom.
   ========================================================= */
(async () => {
  "use strict";
  const M = window.Museo;
  const data = await M.loadData();
  data.cars.forEach(M.resolveImages);

  const n = data.cars.filter((c) => M.isRoomOpen(c)).length, soon = data.cars.length - n;   // abiertas ya (sin apertura pendiente)
  document.querySelector(".topbar__meta").textContent = `Hall principal · ${n} ${n === 1 ? "sala" : "salas"}${soon ? ` · ${soon} en desarrollo` : ""}`;
  const marks = [...new Set(data.cars.flatMap((c) => c.marks || []))];
  document.querySelector(".footer-slot").outerHTML = M.footer(marks);
  document.documentElement.classList.add("is-ready");
  M.hallReady = true;
  M.hallCars = data.cars;
  M.hallPlanned = data.museum.plannedRooms;      // salas previstas en total (tablero de telemetría del Hall)
  M.wings = data.museum.wings || {};             // alas temáticas ("dos-ruedas"): las usan el anillo y el índice
  document.dispatchEvent(new CustomEvent("museo:hall", { detail: { cars: data.cars } }));
})();
