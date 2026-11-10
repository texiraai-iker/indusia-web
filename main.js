(function () {
  "use strict";

  /* ---------- Demo de audio ----------
     Cuando tengas la grabación, sube el archivo (por ejemplo demo.mp3) a esta carpeta
     y pon su nombre aquí. Si lo dejas vacío, la web muestra el botón de WhatsApp. */
  var DEMO_SRC = "";
  var DEMO_CAPTION = "Llamada de prueba con uno de nuestros agentes telefónicos.";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (id) { return document.getElementById(id); };
  var clamp = function (x, a, b) { return Math.min(b, Math.max(a, x)); };

  /* ---------- Onda del reproductor ---------- */
  var player = $("player");
  if (player) {
    var wave = player.querySelector(".wave");
    var heights = [22, 38, 30, 56, 44, 70, 52, 86, 60, 74, 48, 92, 66, 80, 54, 68, 40, 58, 34, 50, 28, 42, 24, 36, 20, 32, 26, 18];
    heights.forEach(function (h) { var i = document.createElement("i"); i.style.height = h + "%"; wave.appendChild(i); });
    if (DEMO_SRC) {
      $("demo-audio").src = DEMO_SRC;
      $("demo-caption").textContent = DEMO_CAPTION;
      player.querySelector(".yes").hidden = false;
      player.querySelector(".none").hidden = true;
      player.classList.add("has-audio");
    }
  }

  /* ---------- Hero: la transformación, ligada al scroll ----------
     Línea de tiempo (p = progreso del scroll dentro del hero, de 0 a 1):
     0.00-0.07  sale el texto de entrada
     0.02-0.16  las tarjetas del negocio "caótico" se esparcen
     0.10-0.31  "Tu negocio hoy" y contador de llamadas perdidas
     0.31-0.50  entra Indusia: ondas de choque
     0.36-0.62  las tarjetas se ordenan en cuadrícula
     0.46-0.74  cada tarjeta pasa de problema a solución
     0.64-1.00  "Tu negocio, en orden" y llamada a la acción */
  var hero = document.querySelector(".hero");
  var stage = hero && hero.querySelector(".stage");

  if (hero && stage && !reduce) {
    hero.classList.add("is-live");
    var cnt = $("cnt"), cntWrap = $("cnt-wrap");
    var ease = function (x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
    var seg = function (p, a, b) { return clamp((p - a) / (b - a), 0, 1); };
    var set = function (k, v) { stage.style.setProperty(k, v.toFixed(4)); };
    var ticking = false, lastN = -1, lastOk = null;

    var update = function () {
      ticking = false;
      var total = hero.offsetHeight - window.innerHeight;
      var top = hero.getBoundingClientRect().top;
      var p = total > 0 ? clamp(-top / total, 0, 1) : 0;

      set("--i", 1 - seg(p, 0, 0.07));
      set("--s", ease(seg(p, 0.02, 0.16)));
      set("--t1", Math.min(seg(p, 0.10, 0.15), 1 - seg(p, 0.31, 0.36)));
      set("--b", seg(p, 0.31, 0.50));
      set("--b2", seg(p, 0.35, 0.56));
      set("--t2", Math.min(seg(p, 0.33, 0.38), 1 - seg(p, 0.54, 0.59)));
      set("--m", ease(seg(p, 0.36, 0.62)));
      set("--c", ease(seg(p, 0.46, 0.74)));
      set("--t3", seg(p, 0.64, 0.70));
      set("--o", seg(p, 0.78, 0.86));
      set("--ctr", seg(p, 0.12, 0.17));

      var n = p < 0.34 ? Math.round(8 * seg(p, 0.10, 0.30)) : Math.round(8 * (1 - seg(p, 0.40, 0.54)));
      if (n !== lastN) { cnt.textContent = n; lastN = n; }
      var ok = p > 0.54;
      if (ok !== lastOk) { cntWrap.classList.toggle("ok", ok); lastOk = ok; }

      hero.classList.toggle("intro-off", p > 0.07);
      hero.classList.toggle("outro-on", p > 0.8);
    };
    var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  /* ---------- Sistema animado del inicio ----------
     Con movimiento reducido se para la animación SVG. */
  var sysSvg = document.querySelector(".sys-svg");
  if (sysSvg && reduce && sysSvg.pauseAnimations) sysSvg.pauseAnimations();

  /* ---------- Pestañas de servicios ---------- */
  var tabs = document.querySelectorAll('.tabs [role="tab"]');
  if (tabs.length) {
    document.documentElement.classList.add("has-tabs");
    var pick = function (t, focus) {
      tabs.forEach(function (b) {
        var on = b === t;
        b.setAttribute("aria-selected", on ? "true" : "false");
        b.tabIndex = on ? 0 : -1;
        $(b.getAttribute("aria-controls")).hidden = !on;
      });
      if (focus) t.focus();
    };
    tabs.forEach(function (b, i) {
      b.addEventListener("click", function () { pick(b, false); });
      b.addEventListener("keydown", function (e) {
        var k = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (k) { e.preventDefault(); pick(tabs[(i + k + tabs.length) % tabs.length], true); }
      });
    });
    pick(tabs[0], false);
  }

  /* ---------- Sectores y calculadora ----------
     Los textos y los números de ejemplo de cada sector salen de SECTORS
     (se generan desde sect_data.py). "other" es el caso "Otro negocio". */
  var SECTORS = {"list": [{"n": "Restaurantes y bares", "l": "Que el teléfono no te saque de la sala.", "g": [["Reservas de mesa por teléfono, también con el local cerrado", "Dudas por WhatsApp: horario, carta, alérgenos, aparcamiento", "Aviso a una persona cuando llaman para un grupo grande o un evento"], ["Recordatorio de la reserva para evitar mesas vacías", "Petición de reseña al día siguiente y respuestas ya redactadas", "Menú del día y eventos avisados a tus clientes habituales"], ["Pedidos a proveedores preparados según lo que falta", "Facturas de proveedores pasadas solas al Excel o a la gestoría", "Resumen diario de reservas, cancelaciones y caja"]], "c": {"u1": "una reserva", "uN": "reservas", "v": "Lo que te deja de media una reserva", "val": 70, "vmax": 500, "llam": 12, "conv": 6, "hor": 5, "tk": "pedidos a proveedores, facturas, contestar reseñas"}}, {"n": "Cafeterías y panaderías", "l": "Encargos y pedidos sin parar el mostrador.", "g": [["Encargos de tartas y pedidos grandes por teléfono o WhatsApp", "Respuestas sobre horarios y productos sin gluten o sin lactosa", "Pedidos de empresas y oficinas recogidos con todos los datos"], ["Aviso al cliente cuando su encargo está listo", "Promociones y novedades por WhatsApp a clientes habituales", "Respuesta a las reseñas de Google"], ["Hoja de producción del día con todos los encargos", "Pedidos a proveedores según lo que se vende", "Ventas y mermas por producto en un Excel que se rellena solo"]], "c": {"u1": "un encargo", "uN": "encargos", "v": "Lo que te deja de media un encargo", "val": 35, "vmax": 300, "llam": 8, "conv": 5, "hor": 5, "tk": "apuntar encargos, pedidos a proveedores"}}, {"n": "Hoteles y casas rurales", "l": "Más reservas directas, a cualquier hora.", "g": [["Disponibilidad y precios por teléfono a cualquier hora", "Respuestas en varios idiomas por WhatsApp y correo", "Dudas de llegada, parking, mascotas o entrada tarde"], ["Mensaje de bienvenida con instrucciones antes de llegar", "Recomendaciones de la zona y reserva de actividades", "Petición de reseña al irse y respuestas ya redactadas"], ["Limpiezas avisadas al personal según las salidas", "Facturas y registro de viajeros preparados", "Resumen de ocupación y reservas por canal"]], "c": {"u1": "una reserva", "uN": "reservas", "v": "Lo que te deja de media una reserva (todas las noches)", "val": 280, "vmax": 2000, "llam": 6, "conv": 4, "hor": 6, "tk": "registro de viajeros, limpiezas, correos"}}, {"n": "Agencias de viajes", "l": "Que ninguna consulta se quede sin respuesta.", "g": [["Primera atención: destino, fechas, personas y presupuesto", "Respuestas sobre documentación, visados y horarios", "La consulta pasa al agente adecuado con todo apuntado"], ["Seguimiento de presupuestos que no han contestado", "Recordatorios de pagos, documentación y salida", "Mensaje después del viaje y petición de reseña"], ["Presupuestos preparados a partir de la consulta", "Bonos y documentación enviados solos", "Clientes y viajes en una sola hoja, siempre al día"]], "c": {"u1": "un viaje vendido", "uN": "viajes", "v": "Lo que te deja de media un viaje vendido", "val": 180, "vmax": 2000, "llam": 8, "conv": 2, "hor": 8, "tk": "presupuestos, documentación, seguimiento"}}, {"n": "Clínicas dentales", "l": "La agenda llena y el teléfono atendido.", "g": [["Citas, cambios y cancelaciones por teléfono", "Respuestas sobre precios orientativos, financiación y horarios", "Urgencias detectadas y pasadas a una persona al momento"], ["Recordatorio de cita para que no falten", "Huecos libres ofrecidos a pacientes en lista de espera", "Aviso de la revisión o la limpieza anual"], ["Seguimiento de presupuestos de tratamiento sin aceptar", "Petición de reseña después de la visita", "Informes de agenda, ausencias y tratamientos"]], "c": {"u1": "un paciente nuevo", "uN": "pacientes nuevos", "v": "Lo que te deja de media un paciente nuevo", "val": 250, "vmax": 3000, "llam": 10, "conv": 3, "hor": 6, "tk": "recordatorios, presupuestos, agenda"}}, {"n": "Fisioterapia y rehabilitación", "l": "Las manos en el paciente, no en el teléfono.", "g": [["Citas y cambios por teléfono mientras estás en sesión", "Respuestas sobre tarifas, bonos y mutuas", "Motivo de consulta recogido antes de la primera visita"], ["Recordatorio de cada sesión", "Huecos libres ofrecidos a la lista de espera", "Ejercicios y seguimiento enviados entre sesiones"], ["Control de bonos y sesiones que quedan", "Facturas a mutuas y pacientes preparadas solas", "Petición de reseña al terminar el tratamiento"]], "c": {"u1": "un paciente nuevo", "uN": "pacientes nuevos", "v": "Lo que te deja de media un paciente nuevo (todas sus sesiones)", "val": 200, "vmax": 2000, "llam": 8, "conv": 4, "hor": 5, "tk": "bonos, facturas, recordatorios"}}, {"n": "Centros médicos", "l": "Que el paciente siempre encuentre a alguien.", "g": [["Citas por teléfono con la especialidad correcta", "Paso a una persona cuando es urgente o delicado", "Respuestas sobre horarios, preparación de pruebas y documentos"], ["Recordatorios para reducir las citas a las que no se acude", "Aviso de que hay documentos listos para recoger", "Revisiones periódicas recordadas a tiempo"], ["Formularios de primera visita rellenados antes de llegar", "Facturas a aseguradoras preparadas", "Informes de actividad por profesional"]], "c": {"u1": "un paciente nuevo", "uN": "pacientes nuevos", "v": "Lo que te deja de media un paciente nuevo", "val": 120, "vmax": 2000, "llam": 15, "conv": 3, "hor": 8, "tk": "formularios, recordatorios, facturas"}}, {"n": "Clínicas veterinarias", "l": "Citas atendidas y urgencias que llegan a una persona.", "g": [["Citas y cambios por teléfono", "Urgencias detectadas y pasadas a una persona al momento", "Respuestas sobre horarios, precios orientativos y peluquería"], ["Recordatorios de vacunas, desparasitación y revisiones", "Aviso cuando la mascota está lista para recoger", "Petición de reseña después de la visita"], ["Pienso y medicación habituales avisados antes de que se acaben", "Ficha de cada mascota siempre al día", "Informes de agenda e ingresos"]], "c": {"u1": "un cliente nuevo", "uN": "clientes nuevos", "v": "Lo que te deja de media un cliente nuevo", "val": 150, "vmax": 2000, "llam": 8, "conv": 4, "hor": 5, "tk": "recordatorios, pedidos, fichas"}}, {"n": "Farmacias", "l": "Menos llamadas repetidas, más tiempo en el mostrador.", "g": [["Respuestas sobre horarios, guardias y cómo llegar", "Consultas sobre si ha llegado un encargo", "Paso a una persona para cualquier consulta de salud"], ["Aviso de que el encargo está listo para recoger", "Recordatorio de recoger lo habitual", "Campañas de temporada por WhatsApp"], ["Pedidos a distribuidores según lo que falta", "Control de caducidades en un Excel que se rellena solo", "Respuesta a las reseñas de Google"]], "c": {"u1": "una venta", "uN": "ventas", "v": "Lo que te deja de media una venta", "val": 25, "vmax": 300, "llam": 15, "conv": 4, "hor": 6, "tk": "encargos, pedidos, caducidades"}}, {"n": "Ópticas", "l": "Revisiones en la agenda y clientes avisados.", "g": [["Citas de revisión por teléfono y WhatsApp", "Consultas sobre el estado del pedido", "Respuestas sobre precios orientativos, marcas y horarios"], ["Aviso cuando las gafas o lentillas están listas", "Recordatorio de la revisión anual", "Aviso para reponer lentillas a tiempo"], ["Seguimiento de presupuestos sin cerrar", "Pedidos a proveedores preparados", "Petición de reseña después de la entrega"]], "c": {"u1": "una venta", "uN": "ventas", "v": "Lo que te deja de media una venta", "val": 180, "vmax": 1000, "llam": 6, "conv": 4, "hor": 5, "tk": "avisos, pedidos, revisiones"}}, {"n": "Centros de estética", "l": "Reservas mientras trabajas en cabina.", "g": [["Reservas y cambios de hora por teléfono y WhatsApp", "Respuestas sobre precios, tratamientos y bonos", "Dudas resueltas antes de un tratamiento nuevo"], ["Recordatorio de cada cita", "Aviso a cada clienta cuando le toca la siguiente sesión", "Huecos libres y promociones por WhatsApp"], ["Control de bonos y sesiones", "Fichas de clientes siempre al día", "Petición de reseña y respuestas ya redactadas"]], "c": {"u1": "una cita", "uN": "citas", "v": "Lo que te deja de media una cita", "val": 60, "vmax": 500, "llam": 10, "conv": 6, "hor": 5, "tk": "bonos, fichas, recordatorios"}}, {"n": "Peluquerías y barberías", "l": "Coge citas sin soltar las tijeras.", "g": [["Citas por teléfono con las manos ocupadas", "Citas por WhatsApp a cualquier hora", "Respuestas sobre precios y horarios"], ["Recordatorio de la cita", "Aviso a los habituales cuando les toca volver", "Huecos libres del día ofrecidos por WhatsApp"], ["Pedidos de producto según lo que falta", "Petición de reseña después del servicio", "Resumen semanal de citas y ventas"]], "c": {"u1": "una cita", "uN": "citas", "v": "Lo que te deja de media una cita", "val": 25, "vmax": 200, "llam": 12, "conv": 7, "hor": 4, "tk": "agenda, pedidos, reseñas"}}, {"n": "Gimnasios y centros deportivos", "l": "Más altas y menos bajas.", "g": [["Información de tarifas, horarios y clases", "Reserva de clase de prueba", "Respuestas a socios por WhatsApp"], ["Seguimiento de quien probó y no se apuntó", "Aviso a socios que han dejado de venir", "Avisos de renovación y cambios de horario"], ["Reservas de clases y listas de espera", "Recibos devueltos avisados al momento", "Informes de altas, bajas y asistencia"]], "c": {"u1": "un socio nuevo", "uN": "socios nuevos", "v": "Lo que te deja de media un socio nuevo en un año", "val": 300, "vmax": 2000, "llam": 8, "conv": 3, "hor": 6, "tk": "cobros, listas, seguimiento"}}, {"n": "Academias y autoescuelas", "l": "Cada interesado, atendido y seguido.", "g": [["Información de cursos, precios y horarios", "Datos recogidos de quien pide información", "Respuestas a alumnos por WhatsApp"], ["Seguimiento de quien pidió información y no se matriculó", "Recordatorios de clases y exámenes", "Nuevos cursos avisados a antiguos alumnos"], ["Matrículas y documentación recogidas solas", "Control de pagos y cuotas", "Cambios de horario avisados a alumnos y profesores"]], "c": {"u1": "una matrícula", "uN": "matrículas", "v": "Lo que te deja de media una matrícula", "val": 400, "vmax": 3000, "llam": 6, "conv": 3, "hor": 6, "tk": "matrículas, pagos, horarios"}}, {"n": "Talleres mecánicos", "l": "El teléfono atendido con la cabeza en el motor.", "g": [["Citas de revisión por teléfono", "Consultas sobre el estado del coche", "Datos del coche y del problema recogidos antes de llegar"], ["Aviso cuando el coche está listo", "Recordatorio de ITV y revisiones", "Seguimiento de presupuestos sin aceptar"], ["Pedidos de recambios preparados", "Presupuestos y facturas pasados a tu programa", "Petición de reseña después de la reparación"]], "c": {"u1": "una reparación", "uN": "reparaciones", "v": "Lo que te deja de media una reparación", "val": 250, "vmax": 2000, "llam": 8, "conv": 4, "hor": 6, "tk": "presupuestos, recambios, avisos"}}, {"n": "Concesionarios", "l": "Ningún interesado se queda sin respuesta.", "g": [["Consultas sobre coches, precios y financiación", "Citas para pruebas y tasaciones", "Citas de taller por teléfono"], ["Seguimiento de interesados que no han vuelto", "Avisos de revisión y fin de garantía", "Ofertas a clientes según el coche que tienen"], ["Contactos de portales pasados a tu programa", "Documentación de venta preparada", "Informes de contactos y ventas"]], "c": {"u1": "una venta", "uN": "ventas", "v": "Lo que te deja de media una venta", "val": 1200, "vmax": 10000, "llam": 4, "conv": 1, "hor": 8, "tk": "contactos, documentación, seguimiento"}}, {"n": "Inmobiliarias", "l": "Quien llama por un anuncio, atendido en el momento.", "g": [["Atención a quien llama por un anuncio, a cualquier hora", "Recogida de qué busca y con qué presupuesto", "Cita para la visita en el calendario del comercial"], ["Seguimiento de interesados después de la visita", "Aviso de pisos nuevos según lo que busca cada uno", "Atención a propietarios que quieren vender o alquilar"], ["Contactos de portales pasados a tu programa", "Fichas de inmuebles preparadas", "Informe de visitas para cada propietario"]], "c": {"u1": "una operación", "uN": "operaciones", "v": "Lo que te deja de media una operación", "val": 3000, "vmax": 20000, "llam": 4, "conv": 0.5, "hor": 8, "tk": "fichas, contactos, informes"}}, {"n": "Despachos de abogados", "l": "Primera atención seria, aunque estés en un juicio.", "g": [["Primera atención y motivo de la consulta recogido", "Citas en la agenda del abogado adecuado", "Respuestas sobre horarios, primera consulta y qué documentos traer"], ["Recordatorio de citas y de la documentación", "Novedades de su asunto avisadas al cliente", "Seguimiento de consultas que no se cerraron"], ["Lectura y clasificación automática de documentos", "Control de plazos con avisos", "Minutas y facturas preparadas"]], "c": {"u1": "un cliente nuevo", "uN": "clientes nuevos", "v": "Lo que te deja de media un asunto nuevo", "val": 900, "vmax": 10000, "llam": 4, "conv": 2, "hor": 8, "tk": "documentos, plazos, facturas"}}, {"n": "Gestorías y asesorías", "l": "Menos dudas repetidas y más tiempo para lo importante.", "g": [["Respuestas a las dudas frecuentes de clientes", "Citas por teléfono y WhatsApp", "Documentación recogida por WhatsApp"], ["Aviso de plazos de impuestos a cada cliente", "Recordatorio de la documentación que falta", "Atención a quien pide presupuesto"], ["Lectura automática de facturas y tickets", "Datos pasados al programa contable", "Informe mensual para cada cliente"]], "c": {"u1": "un cliente nuevo", "uN": "clientes nuevos", "v": "Lo que te deja de media un cliente nuevo en un año", "val": 800, "vmax": 5000, "llam": 3, "conv": 2, "hor": 12, "tk": "facturas, documentos, avisos"}}, {"n": "Arquitectura y reformas", "l": "Que ningún presupuesto se quede en el aire.", "g": [["Primera atención y qué obra quieren hacer", "Cita para ver la casa o el local", "Respuestas sobre plazos, licencias y forma de trabajar"], ["Seguimiento de presupuestos enviados", "Avance de la obra avisado al cliente", "Petición de reseña al terminar"], ["Presupuestos preparados desde una plantilla", "Partes de obra y fotos ordenados", "Facturas y certificaciones preparadas"]], "c": {"u1": "una obra", "uN": "obras", "v": "Lo que te deja de media una obra", "val": 2500, "vmax": 30000, "llam": 3, "conv": 1, "hor": 8, "tk": "presupuestos, partes, facturas"}}, {"n": "Tiendas de cocinas, baños y armarios", "l": "Como el caso de arriba, y mucho más.", "g": [["Reserva de visitas a la tienda por teléfono", "Respuestas sobre horarios, plazos y forma de trabajar", "Medidas y qué buscan, recogidos antes de la visita"], ["Recordatorio de la visita", "Seguimiento de quien visitó y no ha decidido", "Aviso de fechas de entrega y montaje"], ["Presupuestos preparados junto al diseño", "Pedidos a fábrica controlados", "Petición de reseña después del montaje"]], "c": {"u1": "una venta", "uN": "ventas", "v": "Lo que te deja de media una venta", "val": 2000, "vmax": 20000, "llam": 3, "conv": 1, "hor": 6, "tk": "presupuestos, pedidos, seguimiento"}}, {"n": "Fontanería y electricidad", "l": "Atiende avisos aunque estés en otro domicilio.", "g": [["Avisos atendidos mientras trabajas", "Urgencias detectadas y avisadas al momento", "Dirección, problema y fotos recogidos por WhatsApp"], ["Cita y aviso de llegada al cliente", "Seguimiento de presupuestos", "Recordatorio de revisiones y mantenimientos"], ["Partes de trabajo convertidos en factura", "Presupuestos preparados desde una plantilla", "La ruta del día ordenada"]], "c": {"u1": "un trabajo", "uN": "trabajos", "v": "Lo que te deja de media un trabajo", "val": 180, "vmax": 3000, "llam": 8, "conv": 4, "hor": 6, "tk": "partes, presupuestos, facturas"}}, {"n": "Empresas de limpieza", "l": "Presupuestos rápidos y equipos bien avisados.", "g": [["Peticiones de presupuesto por teléfono y web", "Cambios de servicio y avisos de clientes", "Respuestas sobre precios orientativos y zonas"], ["Seguimiento de presupuestos", "Encuesta de satisfacción después del servicio", "Servicios extra ofrecidos: cristales, fin de obra"], ["Cuadrantes avisados al personal", "Facturas de servicios fijos hechas solas cada mes", "Control de horas y servicios hechos"]], "c": {"u1": "un cliente nuevo", "uN": "clientes nuevos", "v": "Lo que te deja de media un cliente nuevo en un año", "val": 1200, "vmax": 10000, "llam": 3, "conv": 2, "hor": 8, "tk": "cuadrantes, facturas, horas"}}, {"n": "Comercios y tiendas", "l": "Vende también cuando estás atendiendo.", "g": [["Consultas de horarios, existencias y precios", "Pedidos y reservas de producto por WhatsApp", "Respuestas sobre cambios y devoluciones"], ["Aviso de que el pedido está listo", "Campañas por WhatsApp a clientes antiguos", "Petición y respuesta de reseñas"], ["Existencias en un Excel que se rellena solo", "Pedidos a proveedores preparados", "Facturas de proveedores pasadas solas"]], "c": {"u1": "una venta", "uN": "ventas", "v": "Lo que te deja de media una venta", "val": 40, "vmax": 500, "llam": 10, "conv": 4, "hor": 6, "tk": "existencias, pedidos, facturas"}}, {"n": "Tiendas online", "l": "Atención al cliente sin estar pegado al móvil.", "g": [["Dudas de envíos, tallas y devoluciones por chat y WhatsApp", "Estado del pedido contestado al momento", "Atención por teléfono para pedidos grandes"], ["Recuperación de carritos abandonados", "Avisos de pedido enviado y entregado", "Petición de reseña y campañas a clientes"], ["Pedidos pasados al almacén o al transportista", "Devoluciones gestionadas paso a paso", "Informes de ventas por producto"]], "c": {"u1": "una venta", "uN": "ventas", "v": "Lo que te deja de media una venta", "val": 45, "vmax": 500, "llam": 20, "conv": 2, "hor": 8, "tk": "pedidos, devoluciones, informes", "ch": "Chats y mensajes sin contestar a tiempo cada semana"}}, {"n": "Transporte y mensajería", "l": "Clientes informados sin llamadas de \"¿dónde está mi envío?\".", "g": [["Consultas sobre el estado de los envíos", "Peticiones de recogida", "Registro de incidencias"], ["Avisos de recogida y entrega", "Presupuestos de envíos", "Encuesta después de la entrega"], ["Albaranes leídos y pasados a tu programa", "Rutas y avisos a conductores", "Facturas a clientes fijos hechas solas"]], "c": {"u1": "un cliente nuevo", "uN": "clientes nuevos", "v": "Lo que te deja de media un cliente nuevo", "val": 150, "vmax": 5000, "llam": 10, "conv": 2, "hor": 10, "tk": "albaranes, rutas, facturas"}}, {"n": "Ferreterías y distribuidores", "l": "Pedidos por teléfono que no se pierden.", "g": [["Consultas de existencias y precios", "Pedidos por teléfono y WhatsApp recogidos completos", "Respuestas sobre plazos de entrega"], ["Aviso de pedido listo o en reparto", "Ofertas a clientes profesionales", "Seguimiento de presupuestos"], ["Lectura automática de albaranes y facturas", "Avisos de reposición", "Tarifas actualizadas en tu programa"]], "c": {"u1": "un pedido", "uN": "pedidos", "v": "Lo que te deja de media un pedido", "val": 120, "vmax": 3000, "llam": 10, "conv": 5, "hor": 8, "tk": "albaranes, tarifas, pedidos"}}, {"n": "Constructoras", "l": "Obras, papeles y clientes, en orden.", "g": [["Primera atención y cita para presupuesto", "Atención a proveedores y subcontratas", "Incidencias de obra avisadas al momento"], ["Seguimiento de presupuestos", "Avance de la obra avisado al cliente", "Repasos de posventa recogidos y ordenados"], ["Partes de obra pasados a tu programa", "Documentación de obra y de seguridad ordenada", "Certificaciones y facturas preparadas"]], "c": {"u1": "una obra", "uN": "obras", "v": "Lo que te deja de media una obra", "val": 6000, "vmax": 50000, "llam": 2, "conv": 0.5, "hor": 10, "tk": "partes, documentos, certificaciones"}}, {"n": "Industria y fabricación", "l": "Menos papeles y más producción.", "g": [["Pedidos y consultas de clientes atendidos", "Estado de los pedidos contestado al momento", "Atención a proveedores"], ["Confirmaciones y avisos de envío", "Seguimiento de ofertas enviadas", "Encuestas a clientes"], ["Lectura automática de pedidos, albaranes y facturas", "Informes de producción", "Datos pasados a tu programa de gestión"]], "c": {"u1": "un pedido", "uN": "pedidos", "v": "Lo que te deja de media un pedido", "val": 800, "vmax": 20000, "llam": 3, "conv": 3, "hor": 12, "tk": "pedidos, albaranes, informes"}}, {"n": "Eventos y catering", "l": "Cada fecha libre, vendida.", "g": [["Peticiones de presupuesto y fechas libres", "Respuestas sobre menús, espacios y precios orientativos", "Número de invitados y necesidades recogidos"], ["Seguimiento de propuestas", "Recordatorios de pagos y fechas clave", "Petición de reseña después del evento"], ["Presupuestos preparados desde una plantilla", "Hoja de producción y personal para cada evento", "Pedidos a proveedores"]], "c": {"u1": "un evento", "uN": "eventos", "v": "Lo que te deja de media un evento", "val": 1500, "vmax": 20000, "llam": 3, "conv": 1, "hor": 8, "tk": "presupuestos, hojas de evento, pedidos"}}, {"n": "Fotografía y estudios creativos", "l": "Más tiempo creando y menos contestando.", "g": [["Primera consulta y reserva de sesiones", "Respuestas sobre tarifas y disponibilidad", "Recogida de lo que quiere el cliente"], ["Seguimiento de presupuestos", "Recordatorio de la sesión", "Petición de reseña después de la entrega"], ["Contratos y facturas preparados", "Entregas enviadas automáticamente", "Agenda y pagos controlados"]], "c": {"u1": "un encargo", "uN": "encargos", "v": "Lo que te deja de media un encargo", "val": 400, "vmax": 5000, "llam": 5, "conv": 3, "hor": 6, "tk": "contratos, entregas, facturas"}}, {"n": "Asociaciones y cooperativas", "l": "Socios atendidos sin saturar a nadie.", "g": [["Consultas de socios atendidas", "Respuestas sobre horarios, cuotas y actividades", "Recogida de incidencias"], ["Inscripciones a actividades", "Avisos a todos los socios y recordatorios", "Encuestas a socios"], ["Control de cuotas y altas", "Actas y documentos ordenados", "Informes para la junta"]], "c": {"u1": "un socio nuevo", "uN": "socios nuevos", "v": "Lo que aporta de media un socio nuevo en un año", "val": 120, "vmax": 2000, "llam": 5, "conv": 3, "hor": 8, "tk": "cuotas, inscripciones, avisos"}}], "other": {"n": "Tu negocio, aunque no esté en la lista", "l": "Casi siempre hay llamadas, mensajes y tareas que se pueden mejorar.", "g": [["Teléfono atendido a cualquier hora", "WhatsApp contestado al momento", "Llamadas importantes pasadas a una persona"], ["Citas, reservas o pedidos apuntados solos", "Recordatorios y seguimiento de clientes", "Reseñas de Google pedidas y contestadas"], ["Tareas repetitivas quitadas de en medio", "Tus programas conectados entre sí", "Informes de tu negocio de un vistazo"]], "c": {"u1": "un cliente", "uN": "clientes", "v": "Lo que te deja de media un cliente nuevo", "val": 150, "vmax": 3000, "llam": 10, "conv": 3, "hor": 6, "tk": "pasar datos, contestar correos, preparar informes"}}};
  var getS = function (key) { return key === "other" ? SECTORS.other : SECTORS.list[+key]; };
  var chosen = "0";
  var setCalc = null;

  var sp = $("sp");
  if (sp) {
    var pills = document.querySelectorAll(".pills button");
    var fill = function (ul, items) {
      ul.textContent = "";
      items.forEach(function (t) { var li = document.createElement("li"); li.textContent = t; ul.appendChild(li); });
    };
    var show = function (key, fromClick) {
      var d = getS(key);
      chosen = key;
      $("sp-h").textContent = d.n;
      $("sp-l").textContent = d.l;
      d.g.forEach(function (items, i) { fill($("sp-" + i), items); });
      pills.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-i") === String(key) ? "true" : "false"); });
      sp.classList.remove("swap"); void sp.offsetWidth; if (!reduce) sp.classList.add("swap");
      if (setCalc) setCalc(key);
      // En móvil el panel queda debajo de la lista: lo acercamos
      if (fromClick && window.innerWidth < 1000) sp.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    };
    pills.forEach(function (b) { b.addEventListener("click", function () { show(b.getAttribute("data-i"), true); }); });
    $("sp-cta").addEventListener("click", function () {
      var f = $("f-negocio");
      if (f && chosen !== "other" && !f.value.trim()) f.value = getS(chosen).n;
    });
    show("0", false);
  }

  var kLlam = $("k-llam");
  if (kLlam) {
    var kBiz = $("k-biz"), kConv = $("k-conv"), kVal = $("k-val"), kHor = $("k-hor"), kEur = $("k-eur");
    var WEEKS = 46;
    var eur = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0, useGrouping: "always" });
    var num = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 1 });
    var shown = { tot: 0, llam: 0, hor: 0 }, raf = 0, cur = getS("0").c;
    var paint = function () {
      $("r-tot").textContent = eur.format(shown.tot);
      $("r-llam").textContent = eur.format(shown.llam);
      $("r-hor").textContent = eur.format(shown.hor);
    };
    var calc = function () {
      var llam = +kLlam.value, conv = +kConv.value, val = +kVal.value, hor = +kHor.value, ph = +kEur.value;
      $("o-llam").textContent = llam; $("o-conv").textContent = num.format(conv);
      $("o-val").textContent = eur.format(val); $("o-hor").textContent = hor; $("o-eur").textContent = eur.format(ph);

      var lostWeek = llam * conv / 10;
      var a = Math.round(lostWeek * val * WEEKS);
      var b = Math.round(hor * ph * WEEKS);
      $("r-l1").textContent = llam + " sin contestar a la semana × " + num.format(conv) + " de cada 10 = " + num.format(lostWeek) + " " + cur.uN + " que se pierden cada semana";
      $("r-l2").textContent = num.format(lostWeek) + " × " + eur.format(val) + " × " + WEEKS + " semanas";
      $("r-h1").textContent = hor + " h a la semana × " + eur.format(ph) + " × " + WEEKS + " semanas";
      var year = Math.round(lostWeek * WEEKS);
      $("r-sum").textContent = year > 0
        ? "En un año: " + year + " " + cur.uN + " que acaban en otro sitio y " + (hor * WEEKS) + " horas en tareas que pueden hacerse solas."
        : "Con estos números no se te escapan " + cur.uN + ", y pasas " + (hor * WEEKS) + " horas al año en tareas que pueden hacerse solas.";

      var target = { tot: a + b, llam: a, hor: b };
      cancelAnimationFrame(raf);
      if (reduce) { shown = target; paint(); return; }
      var from = { tot: shown.tot, llam: shown.llam, hor: shown.hor }, t0 = performance.now();
      var step = function (now) {
        var k = clamp((now - t0) / 350, 0, 1), e = 1 - Math.pow(1 - k, 3);
        shown = { tot: from.tot + (target.tot - from.tot) * e, llam: from.llam + (target.llam - from.llam) * e, hor: from.hor + (target.hor - from.hor) * e };
        paint();
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    // Pone los textos y los números de ejemplo del negocio elegido
    setCalc = function (key) {
      var c = getS(key).c;
      cur = c;
      kBiz.value = key;
      $("l-llam").textContent = c.ch || "Llamadas y mensajes que se quedan sin contestar cada semana";
      $("l-conv").textContent = "De cada 10, ¿cuántas acabarían siendo " + c.u1 + "?";
      $("h-conv").textContent = "Piensa en las que sí atiendes: de cada 10, ¿cuántas acaban siendo " + c.uN + "?";
      $("l-val").textContent = c.v;
      $("h-hor").textContent = "Tuyas y de tu equipo. Por ejemplo: " + c.tk + ".";
      var st = c.vmax <= 500 ? 5 : c.vmax <= 3000 ? 10 : c.vmax <= 10000 ? 50 : 100;
      kVal.min = st; kVal.max = c.vmax; kVal.step = st;
      kLlam.value = c.llam; kConv.value = c.conv; kVal.value = c.val; kHor.value = c.hor; kEur.value = 20;
      calc();
    };
    kBiz.addEventListener("change", function () { setCalc(kBiz.value); });
    [kLlam, kConv, kVal, kHor, kEur].forEach(function (el) { el.addEventListener("input", calc); });
    setCalc(chosen);
    $("r-cta").addEventListener("click", function () {
      var m = $("f-mensaje"), f = $("f-negocio"), key = kBiz.value;
      if (f && key !== "other" && !f.value.trim()) f.value = getS(key).n;
      if (m && !m.value.trim()) m.value = "Según la calculadora se me escapan unos " + eur.format(Math.round(shown.tot)) + " al año entre llamadas sin contestar y tareas repetitivas. Me gustaría revisarlo con vosotros.";
    });
  }

  /* ---------- Movimiento al hacer scroll ----------
     Cada bloque entra al bajar y se "recoge" si vuelves a subir por encima,
     así la animación se repite cada vez que bajas. Con movimiento reducido no se hace nada. */
  if (!reduce && "IntersectionObserver" in window) {
    var root = document.documentElement;
    root.classList.add("motion");

    // Títulos palabra a palabra
    var splitWords = function (el) {
      var words = el.textContent.trim().split(/\s+/);
      el.setAttribute("aria-label", el.textContent.trim());
      el.textContent = "";
      words.forEach(function (w, i) {
        var o = document.createElement("span"); o.className = "w"; o.setAttribute("aria-hidden", "true");
        var s = document.createElement("span"); s.textContent = w; s.style.setProperty("--wi", i);
        o.appendChild(s); el.appendChild(o);
        if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
      });
      el.classList.add("rv-words");
    };
    document.querySelectorAll(".sec-head h2, .case h3").forEach(splitWords);
    var h1 = document.querySelector(".hero h1");
    if (h1) { splitWords(h1); requestAnimationFrame(function () { setTimeout(function () { h1.classList.add("in"); }, 60); }); }

    // Qué entra y desde dónde
    var groups = [
      [".sec-head p, .sec-note, .closer, .demo .player, .ba .head", "rv-up"],
      [".rows li", "rv-l"],
      [".tabs button, .pills li, .chips li", "rv-pop"],
      [".svc details, .faq details, .ctrl, .steps li", "rv-up"],
      [".case dl > div, .sp, .res", "rv-r"],
      [".ba .row time", "rv-pop"], [".ba .no", "rv-l"], [".ba .yes", "rv-r"],
      [".why > div:nth-child(odd)", "rv-l"], [".why > div:nth-child(even)", "rv-r"],
      [".contact > *, .foot .wrap > *", "rv-up"]
    ];
    var items = [];
    groups.forEach(function (g) {
      document.querySelectorAll(g[0]).forEach(function (el) {
        var idx = Array.prototype.indexOf.call(el.parentNode.children, el);
        if (el.matches(".ba .no, .ba .yes, .ba .row time")) idx = el.matches("time") ? 0 : el.matches(".no") ? 1 : 2;
        el.classList.add("rv", g[1]);
        el.style.setProperty("--rdl", Math.min(idx, 12) * (el.matches(".pills li, .chips li") ? 0.025 : 0.08) + "s");
        items.push(el);
      });
    });
    document.querySelectorAll(".rv-words").forEach(function (el) { if (el !== h1) items.push(el); });

    var calcReplay = null;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var el = e.target;
        if (e.isIntersecting) {
          if (!el.classList.contains("in")) {
            el.classList.add("in");
            if (el.classList.contains("res") && calcReplay) calcReplay();
          }
        } else if (e.boundingClientRect.top > 0) {
          el.classList.remove("in");          // está por debajo: se repetirá al volver a bajar
        } else {
          el.classList.add("in");             // ya lo has pasado
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0 });
    items.forEach(function (el) { io.observe(el); });

    // La calculadora vuelve a contar desde cero al aparecer
    if (typeof shown !== "undefined" && kLlam) {
      calcReplay = function () { shown = { tot: 0, llam: 0, hor: 0 }; kLlam.dispatchEvent(new Event("input")); };
    }

    // Textos grandes que se iluminan palabra a palabra según bajas
    var lit = [];
    document.querySelectorAll(".big, .outro p, .problem-lit").forEach(function (el) {
      var ws = [];
      var walk = function (node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (n) {
          if (n.nodeType === 3) {
            var parts = n.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
            parts.forEach(function (p) {
              if (!p) return;
              if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
              var s = document.createElement("span"); s.className = "lw"; s.textContent = p; frag.appendChild(s); ws.push(s);
            });
            n.parentNode.replaceChild(frag, n);
          } else if (n.nodeType === 1) walk(n);
        });
      };
      if (el.closest(".hero")) return;
      walk(el);
      lit.push({ el: el, ws: ws });
    });

    // Barra de progreso
    var bar = document.createElement("div"); bar.className = "progress"; bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);

    // Franja: acelera y se inclina con la velocidad del scroll
    var mqRows = Array.prototype.slice.call(document.querySelectorAll(".mq-row"));
    var heads = Array.prototype.slice.call(document.querySelectorAll(".sec-head"));
    var lastY = window.scrollY, lastT = performance.now(), vel = 0, mticking = false, lastSweep = lastY;

    var frame = function () {
      mticking = false;
      var y = window.scrollY, vh = window.innerHeight, now = performance.now();
      var dt = Math.max(16, now - lastT);
      var v = clamp((y - lastY) / dt, -4, 4);
      vel = vel * 0.6 + v * 0.4;
      lastY = y; lastT = now;

      bar.style.transform = "scaleX(" + (y / Math.max(1, root.scrollHeight - vh)).toFixed(4) + ")";
      root.style.setProperty("--vel", vel.toFixed(3));
      mqRows.forEach(function (r, i) {
        var an = r.getAnimations ? r.getAnimations()[0] : null;
        if (an) an.playbackRate = 1 + vel * 6 * (i ? -1 : 1);
      });
      heads.forEach(function (h) {
        var r = h.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var p = clamp((vh - r.top) / (vh + r.height), 0, 1);
        h.style.setProperty("--py", ((0.5 - p) * 70).toFixed(1) + "px");
      });
      lit.forEach(function (o) {
        var r = o.el.getBoundingClientRect();
        if (r.bottom < -50 || r.top > vh + 50) return;
        var p = clamp((vh * 0.9 - r.top) / (r.height + vh * 0.4), 0, 1), n = p * o.ws.length * 1.15;
        o.ws.forEach(function (w, i) { w.style.opacity = (0.16 + 0.84 * clamp(n - i, 0, 1)).toFixed(3); });
      });
      // Si subes, lo que queda por debajo se recoge para repetirse al bajar; al llegar al final se muestra todo
      if (vel < -0.02 || Math.abs(y - lastSweep) > vh) {
        lastSweep = y;
        items.forEach(function (el) { if (el.classList.contains("in") && el.getBoundingClientRect().top > vh) el.classList.remove("in"); });
      }
      if (y >= root.scrollHeight - vh - 4) items.forEach(function (el) { if (el.getBoundingClientRect().top < vh) el.classList.add("in"); });
      if (Math.abs(vel) > 0.01) { mticking = true; requestAnimationFrame(frame); }   // la inercia se apaga sola
    };
    var onS = function () { if (!mticking) { mticking = true; requestAnimationFrame(frame); } };
    window.addEventListener("scroll", onS, { passive: true });
    window.addEventListener("resize", onS);
    frame();
  }

  /* ---------- Formulario ---------- */
  var form = $("form");
  if (form) {
    var msg = $("msg");
    var btn = form.querySelector("button[type=submit]");
    var fields = ["f-nombre", "f-negocio", "f-contacto"].map($);
    var priv = $("f-priv");

    var say = function (text, kind) { msg.textContent = text; msg.className = "msg" + (kind ? " " + kind : ""); };
    fields.concat([priv]).forEach(function (el) {
      el.addEventListener("input", function () { el.removeAttribute("aria-invalid"); });
      el.addEventListener("change", function () { el.removeAttribute("aria-invalid"); });
    });

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var firstBad = null;
      fields.forEach(function (el) {
        var bad = !el.value.trim();
        if (bad) { el.setAttribute("aria-invalid", "true"); if (!firstBad) firstBad = el; }
        else el.removeAttribute("aria-invalid");
      });
      if (!priv.checked) { priv.setAttribute("aria-invalid", "true"); if (!firstBad) firstBad = priv; }
      if (firstBad) {
        say(firstBad === priv ? "Marca la casilla de privacidad para poder enviarlo." : "Rellena nombre, negocio y un teléfono o email.", "err");
        firstBad.focus();
        return;
      }
      btn.disabled = true;
      say("Enviando…", "");
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      }).then(function (r) {
        if (r.ok) {
          form.reset();
          say("Recibido. Te contactamos lo antes posible.", "ok");
        } else {
          throw new Error("bad status");
        }
      }).catch(function () {
        say("No se ha podido enviar. Escríbenos por WhatsApp al +34 691 093 733.", "err");
      }).then(function () { btn.disabled = false; });
    });
  }
})();
