# One Pace en Español — Stremio Addon

[![Stremio Addon](https://img.shields.io/badge/Stremio-Addon-purple.svg?style=for-the-badge)](https://www.stremio.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)

Un addon de Stremio que integra el catálogo de **One Pace** con subtítulos y doblaje al español, combinando las versiones oficiales del proyecto con ediciones fan-made exclusivas de la comunidad en español (*Spanish Pace*, arcos de Wano 45+, Egghead, etc.).

---

## ⚖️ AVISO LEGAL Y DESCARGO DE RESPONSABILIDAD (LEGAL DISCLAIMER)

**Este complemento de Stremio es un servicio puramente tecnológico de agregación y análisis de metadatos de código abierto.**

* **SIN ALMACENAMIENTO NI DISTRIBUCIÓN:** Este addon **NO** aloja, almacena, transmite ni distribuye de forma física ningún tipo de archivo de video, audio o multimedia protegido por derechos de autor. 
* **AGREGADOR DE METADATOS (METADATA AGGREGATOR):** El servidor actúa únicamente como un traductor y procesador de información. Recibe consultas del cliente Stremio, busca coincidencias en bases de datos de texto públicas (`data.json`) y devuelve metadatos en formato JSON.
* **ENLACES EXTERNOS Y P2P:** Los enlaces de reproducción devueltos son exclusivamente **hashes infoHash** de la red pública BitTorrent (reproducidos nativamente por el cliente Stremio de manera P2P) o **enlaces de redirección proxy** hacia casilleros de almacenamiento en la nube de terceros (PixelDrain), los cuales operan de forma totalmente independiente a este software.
* **USO EDUCACIONAL Y DE INVESTIGACIÓN:** Este proyecto ha sido desarrollado con fines educativos y de investigación sobre la interoperabilidad del protocolo de addons de Stremio. Los autores no se responsabilizan del uso que los usuarios finales den a los metadatos expuestos.

---

## 🚀 Características Principales

* 🔄 **Compatibilidad Multiversión Agnóstica:** Soporte completo e inmediato para clientes locales que utilicen identificadores de versiones heredadas (`onepace-es-v2`, `onepace-es-v3`) y la actual (`onepace-es-v4`), evitando pantallas en blanco al cargar el historial o la biblioteca.
* ⚡ **Proxy de Stream Optimizado:** Motor de proxy integrado que resuelve archivos directos de PixelDrain reduciendo el consumo diario de cuota mediante solicitudes por rango (Range/Scrubbing continuo) y cancelación activa de peticiones abortadas.
* 🌐 **Soporte de Socket Dual-Stack:** Enlace automático a interfaces IPv4 (`0.0.0.0`) e IPv6 (`::`) para evitar fallos de resolución de localhost en sistemas nativos Linux/Pop!_OS.
* 🧲 **Integración P2P Nativa:** Conversión automática de metadatos de capítulos oficiales en enlaces magnet torrent reproducibles directamente por Stremio.

---

## 🔧 Requisitos Previos

* [Node.js](https://nodejs.org/) (Versión 20 o superior recomendada)
* [pnpm](https://pnpm.io/) o `npm`

---

## 🛠️ Instalación y Configuración Local

1. **Instalar Dependencias:**
   ```bash
   pnpm install
   ```

2. **Iniciar Servidor de Desarrollo:**
   ```bash
   pnpm run dev
   ```
   *El addon se ejecutará por defecto en el puerto `7000`.*
   * **URL del Manifiesto:** `http://localhost:7000/manifest.json`
   * **Enlace de instalación Stremio:** `stremio://localhost:7000/manifest.json`

3. **Ejecutar Pruebas de Compatibilidad:**
   Garantiza que todos los endpoints (catálogo, metadatos y enrutamiento de streams) respondan de forma correcta para todas las versiones históricas:
   ```bash
   npx tsx scratch/test-compat.ts
   ```

---

## 📦 Estructura del Proyecto

* `src/manifest.ts` — Declaración del complemento y prefijos de versión soportados.
* `src/index.ts` — Configuración del servidor Express, enrutamiento y proxy.
* `src/handlers/` — Controladores de peticiones del protocolo Stremio (`catalog.ts`, `meta.ts`, `stream.ts`).
* `src/lib/` — Utilidades del proxy de descarga y streaming continuo.
* `scratch/` — Conjunto de scripts de prueba y validación local de compatibilidad.
