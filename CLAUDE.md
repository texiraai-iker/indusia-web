# Web de Indusia (indusia.net)

Web de una página de Indusia, agencia de IA del País Vasco: agentes telefónicos con IA, automatizaciones, chatbots, software a medida, apps, gestión de reseñas de Google y diagnóstico gratuito. Público: negocios locales (clínicas, restaurantes, talleres, tiendas, pymes). Objetivo: que reserven un diagnóstico gratis; secundario: que escuchen una demo.

## Estructura

- `index.html`: la página completa (hero con red animada de servicios y transformación al hacer scroll, franja de servicios en movimiento, problema, 38 servicios en 6 categorías con pestañas, demo, caso, antes y después, 32 sectores con panel (9 ideas por sector), calculadora por tipo de negocio, herramientas, cómo trabajamos, por qué nosotros, 9 preguntas, contacto, pie).
- `styles.css`: todos los estilos. Los colores y espacios están como variables al principio (`:root`).
- `main.js`: animación del hero ligada al scroll, pestañas de servicios, reproductor de demo, selector de sectores, calculadora y envío del formulario.
- `aviso-legal.html`, `privacidad.html`, `cookies.html`: páginas legales (plantillas con huecos).
- `fonts/`: Bricolage Grotesque (títulos) e Inter (texto), alojadas en la propia web.
- `logo/`: logo en lima en SVG (vertical, horizontal, solo símbolo y con fondo) y PNG.
- `og-image.png` (imagen al compartir en redes), `apple-touch-icon.png`, `favicon.svg`, `robots.txt`, `sitemap.xml`.

Sin framework, sin dependencias y sin paso de compilación. HTML, CSS y JavaScript sin más.

## Cómo verla y publicarla

- Verla en local: `python -m http.server 8000` dentro de esta carpeta y abrir `http://localhost:8000`.
- Publicada con GitHub Pages desde el repositorio `texiraai-iker/indusia-web` (rama `master`, raíz). Cada push a `master` actualiza indusia.net en 1-2 minutos. El archivo `CNAME` (indusia.net) no se borra. La web anterior está guardada en la rama `web-anterior`.
- DNS en Namecheap: los registros A y `www` apuntan a GitHub Pages y los MX a Google Workspace (correo). No cambiar los nameservers.

## Decisiones de diseño (no cambiar sin avisar)

- Dirección "oscuro técnico": fondo `#0A0B0F`, texto `#EDEDEA`, un único acento lima `#D7FF3A`. El logo (mapa plegado con un cable) va en lima.
- Máximo 2 fuentes. Espaciado en múltiplos de 8px. Titulares con tracking entre -0.02 y -0.03em.
- Un solo momento especial: el hero. Al cargar se ve el logo en el centro de una red de 12 servicios (teléfono, WhatsApp, web, reseñas, Excel, facturas…) con órbitas girando, pulsos de luz que viajan por las conexiones y avisos que aparecen (SVG con animaciones SMIL y CSS). Al hacer scroll la red se agranda y desaparece y un negocio caótico (tarjetas rojas con problemas) recibe a Indusia (ondas de choque), las tarjetas se ordenan en cuadrícula y cada una pasa a solución en lima; el contador de "cosas pendientes" baja a 0 y aparece la llamada a la acción. `main.js` calcula el progreso `p` y guarda variables CSS (`--s,--m,--c,--b,--t1..3,--o`) en `.stage`; el CSS interpola posiciones. La altura del hero es 560vh en escritorio y 520vh en móvil.
- Movimiento al hacer scroll en toda la página (`main.js`, bloque "Movimiento al hacer scroll"; estilos `.motion .rv…`): títulos que suben palabra a palabra, bloques que entran desde abajo o los lados con escalonado, textos grandes que se iluminan palabra a palabra, líneas de los pasos que se dibujan, calculadora que vuelve a contar, franja que acelera e inclina con la velocidad del scroll, cabeceras con parallax suave y barra de progreso lima bajo la cabecera. Se repite cada vez que bajas.
- Con `prefers-reduced-motion` o sin JavaScript, el hero se muestra estático (sin la clase `is-live`) y no hay animaciones de scroll.
- Lo demás es deliberadamente sobrio: sin tarjetas iguales, sin degradados, sin textos en mayúsculas, sin etiquetas sobre los títulos.
- Todo en castellano.

## Reglas de contenido

- Nunca inventar clientes, cifras, reseñas ni resultados. Los casos van anónimos. Los sectores ("Negocios a los que podemos ayudar") son ejemplos, no experiencia con clientes. La calculadora cambia sus textos y números de ejemplo según el negocio elegido (46 semanas al año), enseña la cuenta paso a paso y avisa de que es una estimación. Los textos de sectores y los valores de ejemplo están en `SECTORS`, al principio de la parte de sectores de `main.js`. Revisar y borrar los servicios que Indusia no ofrezca de verdad.
- El único caso real: una tienda de cocinas, baños y armarios del País Vasco con un agente telefónico que reserva visitas. Sin cifras hasta tener datos medidos.
- Contacto: WhatsApp +34 691 093 733, email hola@indusia.net, formulario con Formspree (`https://formspree.io/f/mzdlvyee`).

## Pendiente antes de publicar

- Datos legales en las tres páginas legales: nombre o razón social, NIF y domicilio (están marcados en amarillo con `[RELLENAR]`). Confirmar también el proveedor de alojamiento y el plazo de conservación de datos en `privacidad.html`.
- Grabación de la demo: subir el audio a esta carpeta y poner su nombre en `DEMO_SRC` (primeras líneas de `main.js`). Mientras esté vacío, el botón lleva al WhatsApp.
- Revisar estas frases porque prometen algo: "te damos una propuesta con precio antes de empezar", "cumplimos con el RGPD", "te preparamos una llamada de prueba con el agente".
- Cuando haya calendario de reservas (Cal.com o similar), añadir el botón de reservar hora en el contacto.
- Probar el formulario real una vez publicada la web.

## Al modificar

- Cambios pequeños y explicados. No reestructurar ni añadir librerías sin preguntar.
- Comprobar siempre a 390px y a 1440px de ancho, sin scroll horizontal.
- Mantener contraste legible, foco visible y el botón "Reserva tu diagnóstico gratis" siempre accesible desde la cabecera.
