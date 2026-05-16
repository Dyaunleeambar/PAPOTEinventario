# ☀️📦 PAPOTE — Inventario Fotovoltaico

Aplicación web **completa, offline-first y progresiva (PWA)** para la gestión de inventario de insumos en instalaciones solares. Diseñada para técnicos de campo y gerentes de proyectos, permite registrar movimientos, controlar stock mínimo, generar informes diarios y sincronizar datos de múltiples formas: manual por JSON, WhatsApp, o en tiempo real por WebRTC P2P.

> 🌐 **Funciona completamente en el navegador.** No requiere instalación, servidor ni conexión a internet.
> 
> 📦 **Empaquetada como PWA.** Instálable en móviles (iOS/Android) y escritorio desde el navegador.

---

## ✨ Características Principales

- 🔐 **Autenticación por PIN** (4 dígitos) personalizable por usuario, con ciframiento SHA-256
- 📥📤 **Registro de movimientos completo**: Entradas y salidas con fecha, cantidad, notas, usuario y timestamps
- ✏️ **Edición de movimientos**: Modifica cantidad, fecha y notas de registros existentes
- 🗑️ **Eliminación de movimientos**: Recalcula automáticamente el stock al borrar
- 📦 **Gestión de insumos**: Nombre, categoría, sección, unidad de medida, stock actual/mínimo
- 🏷️ **Categorías personalizables**: Crea y gestiona categorías sin límite
- 🔔 **Sistema dual de alertas**: Umbrales configurables por insumo con niveles **Crítico** (rojo) y **Advertencia** (amarillo)
- ⏳ **Salidas pendientes**: Cola de solicitudes de descontar stock, solo confirmables por gerente
- 👥 **Multi-usuario con roles**: Gerente (acceso completo), Técnico Techo, Técnico Eléctrico
- 📊 **Informes diarios por WhatsApp**: Resumen automático de movimientos y alertas para enviar directo
- 💾 **Respaldos completos en JSON**: Exporta/importa categorías, insumos, movimientos, usuarios con fusión inteligente
- 🔗 **Sincronización P2P en tiempo real**: Conecta dispositivos por WebRTC/QR sin servidor central
- 📶 **Sincronización manual**: Intercambia archivos JSON vía WhatsApp o mediante QR
- 📱 **Interfaz responsiva**: Optimizada para móviles, tablets y escritorio
- 🔌 **Offline completo**: Service Worker incluido para funcionamiento sin conexión

---

## 👥 Roles y Flujo de Trabajo

| Rol | Características |
|-----|----------------------|
| 🧑‍💼 **Gerente** | Acceso completo a todas las secciones. Configura PIN, categorías, usuarios, stock mínimo de cada insumo. Registra entradas automáticamente (descuenta stock al instante). Aprueba/rechaza salidas pendientes. Sincroniza con técnicos. Exporta backups. |
| 👷 **Técnico Techo** | Acceso restringido a sección "Instalación en Techo". Registra entradas (si gerente autoriza) y solicita salidas (pendiente de aprobación). Consulta alertas de su sección. Ve historial propio. Exporta/importa movimientos |
| 🔌 **Técnico Eléctrico** | Acceso restringido a sección "Instalación Eléctrica". Mismo flujo que Técnico Techo pero para su sección. |

### Flujos de Registro

**Entrada (por gerente):**
1. Gerente abre "Registrar Entrada"
2. Selecciona insumo, cantidad, fecha
3. Confirma → Stock se actualiza al instante
4. Movimiento aparece en historial

**Salida (por técnico, requiere aprobación):**
1. Técnico abre "Registrar Salida"
2. Selecciona insumo, cantidad, fecha, notas
3. Envía → Estado: **Pendiente**
4. Gerente ve en "Salidas Pendientes"
5. Gerente aprueba o rechaza
6. Si aprueba → Stock se descuenta y estado pasa a **Confirmada**
7. Si rechaza → Movimiento pasa a **Rechazada**, stock sin cambios

---

## 🛠️ Tecnologías Utilizadas

| Capa | Tecnología | Detalles |
|------|------------|---------|
| **Frontend** | HTML5, CSS3, JavaScript ES6+ (Vanilla) | Sin dependencias externas, todo embebido en un único index.html |
| **Almacenamiento** | **IndexedDB** | Base de datos local persistente en el navegador. Sincronización inteligente por timestamps |
| **Sincronización** | **WebRTC P2P + QR** | Comunicación directa entre dispositivos sin servidor. QR para establecer conexión inicial |
| **Transferencia Manual** | JSON (export/import) | Archivos para compartir por WhatsApp, email o almacenamiento externo |
| **Alertas** | API de WhatsApp (`wa.me/`) | Envía informes directamente a conversaciones de WhatsApp |
| **Offline** | **Service Worker** | Cache strategy: network-first para sincronización, cache-first para assets |
| **Seguridad** | SHA-256 (Web Crypto API) | Hashing de PINs sin transmisión de contraseñas en claro |
| **PWA** | manifest.json + Service Worker | Instálable como app nativa en móviles y desktop |

---

## 📁 Estructura del Proyecto

```
PAPOTEinventario/
├── index.html              # Aplicación completa (HTML + CSS + JS embebido)
├── manifest.json           # Configuración PWA
├── sw.js                   # Service Worker (cache y offline)
├── README.md               # Este archivo
└── icons/                  # Iconos PNG para PWA (192x192, 512x512)
    ├── icon-192.png
    ├── icon-512.png
    └── icon-512-maskable.png
```

### Arquitectura Monolítica

Todo el código está integrado en **index.html** por simplicidad y máxima portabilidad:

- **HTML puro** (líneas 1–400 aprox): Estructura semántica, inputs, modales, overlays
- **CSS embebido** (líneas ~100–300): Todas las clases y animaciones. Variables CSS (`--bg`, `--brand`, etc.)
- **JavaScript** (líneas ~350–1900+): Lógica completa organizada en secciones:

| Sección | Responsabilidad |
|---------|-----------------|
| **CONFIGURACIÓN & ESTADO GLOBAL** | Iconos SVG, DB setup, funciones de hash |
| **ESTADO & SEGURIDAD** | Login, PIN buffer, intento de acceso, level de alertas |
| **NAVEGACIÓN & RENDERIZADO** | Tabs, switching entre secciones, renderizado de vistas |
| **MOVIMIENTOS UNIFICADOS & CRUD** | Crear/editar/eliminar movimientos, validación |
| **SYNC & RESPALDOS** | Export/import JSON, exportación para WhatsApp, backup completo |
| **CONFIGURACIÓN & CATEGORÍAS** | Insumos, categorías, usuarios, cambio de PIN |
| **PENDIENTES & INFORME** | Cola de aprobaciones, generación de reportes |
| **HELPERS & UI** | Formatos, dialogs, toasts, utilidades |
| **INIT & SERVICE WORKER** | Bootstrap y registro de SW |

---

## 🚀 Instalación y Uso

### Requisitos previos
- Navegador moderno (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
- **No requiere**: Node.js, servidor, base de datos externa ni conexión a internet

### Instalación rápida

1. **Descarga o clona** este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/PAPOTEinventario.git
   cd PAPOTEinventario
   ```

2. **Abre en el navegador:**
   - Localmente: Abre `index.html` directamente en el navegador
   - Con servidor local (recomendado para desarrollo):
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Node.js (http-server)
     npx http-server -p 8000
     ```
   - Luego accede a `http://localhost:8000`

3. **Primer acceso:**
   - Selecciona un rol (Gerente, Técnico Techo, Técnico Eléctrico)
   - PIN inicial: Ver tabla abajo
   - Se pide cambiar PIN en la primera entrada
   - La app carga datos de demostración si es la primera vez

### PINs Iniciales (para pruebas)

| Rol | PIN |
|-----|-----|
| 🧑‍💼 Gerente | `1234` |
| 👷 Técnico Techo | `0000` |
| 🔌 Técnico Eléctrico | `1111` |

> ⚠️ **Importante**: Cambia estos PINs en tu primera sesión.

### Instalación como PWA (opcional)

1. Abre la app en el navegador
2. Busca el icono de "Instalar" o "Agregar a inicio" (varía por navegador)
3. La app se instala como aplicación nativa en tu dispositivo
4. Funciona completamente offline incluso desde el desktop

---

## 📋 Guía de Uso por Rol

### 🧑‍💼 Para Gerentes

**Dashboard:**
- Visualiza ambas secciones (Techo y Eléctrico) con indicadores de alerta
- Mira el estado general: Crítico, Advertencia, OK
- Accesos rápidos a registrar entradas/salidas
- Notificación de salidas pendientes por aprobar

**Inventario:**
- Navega entre secciones Techo y Eléctrico
- Ve stock actual, mínimo y estado de alerta por insumo
- Haz clic en un insumo para ver detalles completos
- Edita o elimina insumos

**Configuración:**
- **Insumos**: Crea nuevos insumos, edita nombre/categoría/unidad/stock
- **Categorías**: Agrupa insumos (ej: "Paneles Solares", "Cableado")
- **Stock Mínimo**: Configura alertas individuales por insumo
- **Usuarios**: Crea técnicos, edita PINs, cambia roles

**Alertas:**
- Visualiza insumos con stock bajo o crítico
- Gráficos de cantidad de alertas
- Haz clic para ver detalles

**Historial:**
- Filtra movimientos por sección, tipo, fecha
- Edita movimientos existentes (cantidad, fecha, notas)
- Elimina movimientos (recalcula stock automáticamente)
- Exporta/importa historial completo
- Limpia el historial

**Datos & Respaldo:**
- **Tab Manual**: Exporta/importa datos de técnicos vía WhatsApp
- **Tab Avanzado**: Backup completo y restauración con fusión inteligente
- **Sync P2P**: Conecta por QR con otros dispositivos en red

### 👷 Para Técnicos (Techo/Eléctrico)

**Dashboard:**
- Visualiza tu sección con alertas actuales
- Accesos rápidos: Registrar Salida, Enviar Informe, Sync

**Inventario:**
- Solo ves insumos de tu sección
- Ver stock y alertas
- Click en insumo para detalles

**Alertas:**
- Solo alertas de tu sección
- Total de Críticos y Advertencias

**Historial:**
- Solo tus movimientos
- Edita/elimina tus registros
- Exporta tu historial

**Informe WhatsApp:**
- Resumen del día: Entradas, salidas, alertas
- Click "Enviar WhatsApp" abre conversación
- Puedes copiar el texto también

**Sync Datos:**
- **Manual**: Exporta movimientos para enviar a gerente
- **P2P**: Conecta directamente por QR (si gerente también está en app)

---

## 🔄 Sincronización de Datos

### Opción 1: Manual por WhatsApp (Recomendado para zonas sin WiFi)

1. **Técnico exporta** → "Datos y Respaldo" → "Manual" → "Exportar mis movimientos"
2. Genera JSON y comparte por WhatsApp
3. **Gerente importa** → "Datos y Respaldo" → "Manual" → "Importar datos del técnico"
4. Selecciona archivo JSON
5. Stock se recalcula automáticamente

### Opción 2: P2P en Tiempo Real (Existe WiFi/LTE)

**Gerente inicia:**
1. "Datos y Respaldo" → "Sync P2P" → Muestra QR
2. Técnico escanea con "Escanear QR"
3. Técnico muestra su QR de respuesta
4. Gerente escanea
5. ¡Conectados! Los datos se sincronizan automáticamente

**Cómo funciona:**
- WebRTC establece canal P2P directo (sin servidor)
- Los datos se intercambian de ambos lados
- Fusión inteligente: Gana el registro más reciente (por timestamp)
- Funciona offline, sincroniza cuando hay conexión

### Opción 3: Respaldo Completo (Todas las tiendas)

1. **Exportar**: "Datos y Respaldo" → "Avanzado" → "Exportar Backup Completo"
   - Incluye: Categorías, insumos, entradas, salidas, usuarios
   - Genera `solarstock_backup_NombreUsuario_AAAA-MM-DD.json`
   - Guarda en Google Drive, Dropbox o email

2. **Restaurar**: Otro dispositivo → "Datos y Respaldo" → "Avanzado" → "Restaurar Backup"
   - Selecciona archivo JSON
   - Fusiona sin borrar datos existentes (gana registro más reciente)

---

## 🔔 Sistema de Alertas

### Niveles de Alerta

| Nivel | Condición | Color | Acción |
|-------|-----------|-------|--------|
| **Crítico** 🔴 | Stock ≤ Mínimo | Rojo | Reorden urgente necesario |
| **Advertencia** 🟡 | Stock < Mínimo × 1.5 | Amarillo | Reorden sugerido |
| **OK** 🟢 | Stock ≥ Mínimo × 1.5 | Verde | Stock seguro |

### Cómo configurar

1. Gerente → Configuración → Stock Mínimo por Insumo
2. Selecciona insumo
3. Ajusta valor de "Stock Mínimo"
4. Guarda

**Ejemplo:**
- Insumo: Panel Solar
- Stock Mínimo configurado: 10
- Niveles automáticos:
  - Crítico: ≤ 10
  - Advertencia: 10–15
  - OK: > 15

---

## 📊 Informes y Reportes

### Informe Diario (Técnicos)

Generado automáticamente con:
- Movimientos del día (entrada/salida)
- Estado de alertas (Críticos, Advertencias)
- Nombre técnico, sección, fecha
- Pie de página con timestamp

**Envío:**
- Copia al portapapeles
- Envía directamente por WhatsApp (`wa.me/`)
- Compatible con grupos y contactos individuales

### Historial Completo (Gerentes)

Exporta movimientos filtrados:
- Por rango de fechas
- Por sección
- Por tipo (Entrada/Salida)
- Con usuario, cantidad, notas

**Formatos:**
- JSON (para reimportar a otro dispositivo)
- Texto (para reportes)

---

## 🛠️ Configuración Avanzada

### Base de Datos Local (IndexedDB)

Cada tienda almacena:

| Tienda | Registros | Sincronización |
|--------|-----------|---|
| `usuarios` | PINs hasheados, roles, nombres | Solo lectura (no sincroniza) |
| `categorias` | Nombres, descripciones | Por timestamp (updatedAt) |
| `insumos` | Stock, alertas, unidades | Por timestamp |
| `entradas` | Movimientos de entrada | Por timestamp |
| `salidas` | Solicitudes y salidas | Por timestamp, incluyendo estado |

**Límite teórico:** 50 MB por app (depende del navegador)
**Registros recomendados:** 1,000–5,000 por tienda (óptimo)

### Service Worker (sw.js)

Proporciona:
- Cache de assets (HTML, CSS, JS)
- Funcionalidad offline
- Sincronización en background (cuando conecta)
- Notificaciones push (opcional)

**Estrategia:**
- Network-first para datos (sincronización)
- Cache-first para assets (velocidad)

---

## 🔒 Seguridad y Privacidad

### Almacenamiento de PINs

```javascript
// El PIN nunca se guarda en claro
1. Usuario ingresa: 1234
2. Se hashea con SHA-256 + salt: 
   hash = SHA256("1234" + "solarstock_salt_2024")
3. Solo el hash se guarda en IndexedDB
4. Login: Hashea lo ingresado y compara
```

### Datos Personales

- **Se almacenan localmente**: Nunca suben a intercambio
- **Exportación es manual**: Tú controlas qué compartes
- **Sin tracker**: Código 100% vanilla, sin Google Analytics ni similares
- **HTTPS recomendado**: Si usas servidor remoto

### Recomendaciones

- Usa HTTPS en producción
- Instala app para mayor seguridad (sandbox del navegador)
- Realiza backups frecuentes
- Cambia PINs regularmente
- No compartas JSON con usuarios desconocidos

---

## 📱 Compatibilidad

### Navegadores Soportados

| Navegador | Versión Mínima | Desktop | Móvil | PWA |
|-----------|---|---|---|---|
| Chrome | 80+ | ✅ | ✅ | ✅ |
| Firefox | 75+ | ✅ | ✅ | ⚠️ |
| Safari | 13+ | ✅ | ✅ | ✅ |
| Edge | 80+ | ✅ | ✅ | ✅ |
| Opera | 67+ | ✅ | ✅ | ✅ |

### Tamaño

- **index.html**: ~150 KB (comprimido ~35 KB)
- **Total (con icons)**: ~500 KB
- **En memoria**: ~5–10 MB

### Velocidad

- Carga inicial: 1–2 segundos (dependiendo de dispositivo)
- Interacciones: 0–200ms (instantáneo)
- Sincronización P2P: 2–5 segundos (depende de WiFi)

---

## 🤝 Contribuciones

¿Quieres mejorar PAPOTE?

1. Fork el repositorio
2. Crea una rama para tu feature: `git checkout -b feature/mi-feature`
3. Commit: `git commit -am 'Agregar mi feature'`
4. Push: `git push origin feature/mi-feature`
5. Abre un Pull Request

**Áreas para contribuir:**
- Traducción a otros idiomas
- Mejoras de UX/UI
- Optimizaciones de rendimiento
- Nuevos formatos de exportación
- Tests automatizados

---

## 📄 Licencia

Este proyecto está bajo licencia **MIT**. Puedes usarlo libremente en proyectos personales y comerciales.

---

## 📞 Soporte

- **Issues**: Reporta bugs en GitHub Issues
- **Sugerencias**: Abre una Discusión en GitHub Discussions
- **Contacto**: [Tu email o contacto]

---

## 🗺️ Roadmap

### v2.0 (Planeado)
- [ ] Exportación a PDF/Excel
- [ ] Integración con API de WhatsApp Business
- [ ] Gráficos de tendencias (stock histórico)
- [ ] Códigos de barras/RFID
- [ ] Sincronización automática por Bluetooth

### v3.0 (Futuro)
- [ ] Server central (Node.js + MongoDB)
- [ ] Aplicación nativa (Electron)
- [ ] Predicción de stock con ML
- [ ] Integración con sistemas ERP

---

**Hecho con ❤️ para técnicos solares. ©2026**

```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# Luego abre: http://localhost:8000
```

---

## 🐛 Troubleshooting

### La app no carga
- Verifica que `index.html`, `styles.css` y `app.js` existan en el mismo directorio
- Abre la consola del navegador (F12) para ver errores

### Error de módulos no encontrados
- Asegúrate que las rutas de import son correctas: `import { func } from '../db.js'`
- Los módulos deben estar en la carpeta `modules/` relativa a `index.html`
- Verifica que NO haya errores de sintaxis (la consola los mostrará)

### IndexedDB no funciona
- IndexedDB requiere un contexto seguro (no funciona con `file://`)
- Usa siempre un servidor HTTP local
- Limpia el almacenamiento del navegador (DevTools → Application → IndexedDB)

### PIN no funciona
- PIN por defecto es `1234`
- Si olvidaste el PIN, limpia IndexedDB y reinicia
- Verifica que el navegador no esté en modo privado (algunas funciones se ven afectadas)

---

## 🚀 Roadmap / Funcionalidades Futuras

- [ ] **Sincronización P2P completa** (WebRTC, QR scanning)
- [ ] **Generación de reportes PDF**
- [ ] **Gráficos de tendencias** (stock a lo largo del tiempo)
- [ ] **Notificaciones push** para alertas críticas
- [ ] **Multi-idioma** (Español, Inglés, Portugués)
- [ ] **Modo offline mejorado** (Service Workers)
- [ ] **Integración con APIs** (proveedores, distribuidores)
- [ ] **Importación masiva** desde CSV/Excel
- [ ] **Auditoría completa** de cambios
- [ ] **Roles personalizables** (crear nuevos roles)

---

## 📝 Licencia

Este proyecto está disponible bajo la licencia **MIT**. Úsalo libremente en tus proyectos.

---

## 👨‍💻 Créditos

**Desarrollado por**: Equipo SolarStock  
**Versión actual**: 1.0.0  
**Última actualización**: Mayo 2026

---

## 💬 Soporte

¿Encuentras un bug o tienes una sugerencia?
- Abre un **Issue** en el repositorio
- Describe el problema claramente
- Incluye capturas de pantalla si es posible
- Espera retroalimentación en <24h

---

## 📚 Documentación adicional

Para información más detallada sobre:
- **Configuración avanzada**: Ver comentarios en `db.js`
- **Personalización de estilos**: Edita variables CSS en `styles.css` (líneas 1-8)
- **Lógica de negocio**: Consulta cada módulo en `modules/`