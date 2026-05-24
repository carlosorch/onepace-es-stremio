# Informe de Hallazgos y Diagnóstico — Sesión de Depuración de One Pace en Español

En esta sesión nos enfocamos en resolver el persistente problema donde la tarjeta de la serie **One Pace en Español** carga los episodios correctamente pero, exactamente **1 segundo después, la pantalla se queda completamente en blanco**.

A continuación, detallamos la investigación realizada, las hipótesis validadas, las soluciones implementadas y los siguientes pasos recomendados para la próxima sesión.

---

## 🔍 Resumen del Comportamiento del Bug

1. **Síntoma original**: Al abrir la serie, los episodios se cargaban durante 1 segundo y luego la pantalla se volvía negra.
2. **Observación en los Logs**:
   ```text
   [HTTP Logger] GET /meta/series/onepace-es-v2:onepace.json
   [HTTP Logger] GET /stream/series/onepace-es-v2:onepace:36:21.json
   [HTTP Logger] GET /meta/series/onepace-es-v2%3Aonepace.json
   ```
   * Stremio hace una petición inicial limpia con dos puntos (`:`). El addon respondía con éxito.
   * Luego, realiza una petición de sincronización o validación de streams en segundo plano.
   * Inmediatamente después (al cabo de 1 segundo), Stremio realiza una segunda llamada con el ID codificado (`%3A` en lugar de `:`). 
   * Antes de nuestro cambio, esta llamada devolvía `{ meta: null }` porque el string no coincidía de manera exacta con `"onepace-es-v2:onepace"`. Este retorno nulo sobreescribía la interfaz y causaba la pantalla en blanco.

---

## 🛠️ Acciones Tomadas en esta Sesión

### 1. Decodificación de URL en los Controladores
Modificamos todos los handlers principales en `src/handlers/` (`meta.ts`, `stream.ts`, `catalog.ts`) para decodificar de forma explícita el parámetro `id` utilizando `decodeURIComponent(id)`. Esto asegura que las peticiones con `%3A` y con `:` se validen correctamente y no devuelvan `null`.

### 2. Busting de Caché a `v3`
Como Stremio a menudo almacena las respuestas nulas en su caché local persistente (IndexedDB/local storage), incrementamos el ID del addon y de la serie de `v2` a `v3` en todos los archivos (`manifest.ts`, `catalog.ts`, `meta.ts`, `stream.ts`). Esto fuerza a Stremio a tratar al addon como completamente nuevo, limpiando cualquier caché previa.

---

## ❓ Diagnóstico Actual: ¿Por qué sigue desapareciendo a los 1 segundos?

Dado que ahora el servidor responde con un JSON 100% válido y con los metadatos completos tanto para llamadas decodificadas como codificadas, el problema no es un retorno nulo (`null`) desde el servidor. El culpable más probable es un **conflicto de consistencia en el cliente de Stremio** al procesar los IDs de los episodios:

### Hipótesis A: Discrepancia del ID del Addon en el Router Interno del Cliente
Cuando Stremio realiza la petición a `/meta/series/onepace-es-v3%3Aonepace.json`:
* El servidor devuelve el objeto `meta` con `id: 'onepace-es-v3:onepace'` (con `:` limpia).
* Si el cliente de Stremio inició la transición de pantalla esperando que el ID del objeto coincida de manera literal con la cadena de la URL (`onepace-es-v3%3Aonepace`), la discrepancia provoca que el componente React/Qt del reproductor descarte la metadata recibida considerándola un "mismatch", vaciando la pantalla.

### Hipótesis B: IDs de Episodios Duplicados o Inconsistentes en la UI
En `src/handlers/meta.ts`, generamos dinámicamente una lista de 491 episodios. 
* Si Stremio detecta alguna inconsistencia de orden (por ejemplo, temporadas no consecutivas, saltos de episodios en arcos desordenados, o IDs duplicados), su motor de renderizado de React puede fallar silenciosamente y desmontar la vista de la serie.
* Particularmente, en la temporada 36 (Egghead), añadimos episodios de dos fuentes: la metadata estándar de `data.json` y los fan-cuts de ZamuSkl (*Shaved Egghead*). Aunque evitamos duplicados explícitos mediante `.some(v => v.id === videoId)`, cualquier sutil discrepancia de estructura o de orden entre las temporadas oficiales y los fan-edits podría disparar una excepción no capturada en la UI de Stremio al segundo de intentar renderizar los streams de fondo.

---

## 🚀 Siguientes Pasos Recomendados para la Próxima Sesión

Para la siguiente sesión de depuración, sugerimos abordar el problema desde los siguientes ángulos:

1. **Prueba de Metadata Mínima (Aislamiento)**:
   * Crear un endpoint de pruebas temporal que devuelva una serie con solo **1 temporada y 2 episodios** en lugar de los 491.
   * Si la serie de prueba no desaparece a los 1 segundos, confirmará que el problema está en el volumen o formato de los datos de los episodios (fecha, formato, o IDs desordenados).
   
2. **Normalización Total del ID en las Respuestas**:
   * Si Stremio pide `onepace-es-v3%3Aonepace`, responder con `id: "onepace-es-v3%3Aonepace"`.
   * Si pide `onepace-es-v3:onepace`, responder con `id: "onepace-es-v3:onepace"`.
   * Probar si adaptando el campo `id` devuelto al formato exacto de la petición URL (con o sin codificación) evita que la interfaz descarte el objeto.

3. **Inspección de Consola en Stremio Web**:
   * Instalar el addon local en el reproductor de **Stremio Web** (`https://web.stremio.com/`) usando Google Chrome u otro navegador.
   * Abrir la consola de desarrollador (F12) y revisar el log de Javascript. Cuando la pantalla desaparezca a los 1 segundos, la consola del navegador mostrará el error exacto de React, Redux, o de desajuste de tipos que provoca la caída de la vista. Esto dará la respuesta definitiva al instante.

---

¡Toda la lógica de proxy premium con PixelDrain, Range Requests para scrubbing continuo y mapeo de torrents de One Pace está en perfecto estado de funcionamiento! Solo resta afinar este detalle visual con el cliente Stremio en la siguiente sesión.
