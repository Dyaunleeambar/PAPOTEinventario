# ☀️📦 SolarStock — Inventario Fotovoltaico

Aplicación web ligera y **offline-first** para la gestión de inventario de insumos en instalaciones solares. Diseñada para técnicos de campo y gerentes de proyectos, permite registrar movimientos, controlar stock mínimo, generar informes diarios y sincronizar datos de forma manual mediante archivos JSON o WhatsApp.

> 🌐 Funciona directamente en el navegador. No requiere instalación ni servidor.

---

## ✨ Características Principales

- 🔐 **Acceso rápido por PIN** (4 dígitos) con configuración inicial segura
- 📥📤 **Registro de movimientos**: Entradas y salidas con fecha, cantidad y notas
- 📦 **Gestión de insumos**: Nombre, categoría, sección, unidad de medida, stock actual/mínimo
- 🏷️ **Categorías personalizables**: `Techo` e `Instalación Eléctrica` (extensibles)
- 🔔 **Sistema de alertas**: Umbrales configurables para `Advertencia` y `Crítico`
- ⏳ **Salidas pendientes**: Cola de movimientos por confirmar o despachar
- 📊 **Informes diarios**: Generación automática de reportes listos para copiar o enviar por WhatsApp
- 💾 **Backup/Restore en JSON**: Exportación, importación y fusión inteligente de datos
- 📱 **Interfaz responsiva**: Optimizada para móviles y tablets de trabajo en campo

---

## 👥 Roles y Flujo de Trabajo

| Rol | Características |
|-----|----------------------|
| 🧑‍💼 **Gerente** | Configuración de alertas, gestión de categorías/usuarios, exportación de movimientos, restauración de backups, visión global |
| 👷 **Técnico (Techo)** | Registro de entradas/salidas en sección Techo, consulta de stock, gestión de salidas pendientes |
| 🔌 **Técnico (Eléctrico)** | Registro de entradas/salidas en sección Instalación Eléctrica, consulta de stock, gestión de salidas pendientes |

> 🔁 La sincronización entre dispositivos se realiza mediante intercambio manual de archivos JSON (ideal para entornos sin cobertura estable).

---

## 🛠️ Tecnologías Utilizadas

| Capa | Tecnología |
|------|------------|
| Frontend | HTML5, CSS3, JavaScript ES6+ (Vanilla) |
| Almacenamiento | **IndexedDB** (base de datos local con persistencia) |
| Transferencia de datos | JSON (export/import), API de WhatsApp (`wa.me`) |
| Arquitectura | **Modular** (ES6 modules), Offline-First PWA |

---

## 📁 Estructura del Proyecto

```
PAPOTEinventario/
├── index.html              # Punto de entrada único (HTML limpio, ~300 líneas)
├── styles.css              # Estilos globales (~1300 líneas)
├── README.md               # Este archivo
├── modules/                # Módulos de funcionalidad
│   ├── setup.js            # Inicialización: DB, funciones globales
│   ├── auth.js             # Sistema de autenticación por PIN
│   ├── alerts.js           # Sistema de alertas por stock
│   ├── dashboard.js        # Vista principal (en desarrollo)
│   ├── inventory.js        # Gestión de insumos (en desarrollo)
│   ├── config.js           # Configuración (solo gerente) (en desarrollo)
│   ├── history.js          # Historial de movimientos (en desarrollo)
│   └── sync.js             # Sincronización P2P (planeado)
├── app.js                  # Estado global y mapeos de funciones
├── db.js                   # Abstracción de IndexedDB
└── utils.js                # Funciones utilitarias (iconos, formateo, etc)
```

### Descripción de módulos principales:

| Archivo | Responsabilidad |
|---------|-----------------|
| **index.html** | Estructura HTML pura. Referencias a CSS, importa `app.js` |
| **styles.css** | Todos los estilos (componentes, animaciones, tema oscuro) |
| **app.js** | Exporta estado global, mapea funciones onclick a window |
| **db.js** | Operaciones IndexedDB: CRUD, seed data, hashing SHA-256 |
| **utils.js** | Iconos SVG, formatting, diálogos, toasts, validaciones |
| **auth.js** | Login por PIN, cambio de PIN, gestión de sesión |
| **modules/setup.js** | Inicializa DB, exporta funciones globales |
| **modules/alerts.js** | Lógica de niveles de alerta, renderizado de vista |
| **modules/dashboard.js** | Vista principal con greeting, secciones, acciones rápidas |
| **modules/inventory.js** | Listado y detalle de insumos, CRUD |
| **modules/config.js** | Configuración de categorías, usuarios, stock mínimo |
| **modules/history.js** | Listado filtrable de movimientos |
| **modules/sync.js** | Sincronización P2P y exportación/importación |

---

## 🚀 Instalación y Uso

### Requisitos previos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- No requiere Node.js ni servidor (funciona localmente)

### Pasos de instalación

1. **Clona o descarga el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/solarstock.git
   cd PAPOTEinventario
   ```

2. **Abre en tu navegador:**
   - Opción A: Arrastra `index.html` a tu navegador
   - Opción B: Usa un servidor local simple:
     ```bash
     # Con Python 3
     python -m http.server 8000
     
     # Con Node.js (si tienes http-server instalado)
     npx http-server
     ```
   - Opción C: Despliega en GitHub Pages o cualquier hosting estático

3. **Configuración inicial:**
   - Abre la app en el navegador
   - Selecciona tu rol (Gerente, Técnico Techo o Técnico Eléctrico)
   - Ingresa el PIN por defecto: `1234`
   - Crea un nuevo PIN en el primer acceso
   - ¡Listo! La app está lista para usar

### Uso rápido

**Para Técnicos:**
1. Login con tu PIN
2. Ve a **Inventario** → Selecciona tu sección (Techo o Eléctrico)
3. Registra movimientos en **+ Entrada** o **+ Salida**
4. Consulta stock y alertas en **Alertas**
5. Genera reportes en el Dashboard

**Para Gerentes:**
1. Login con PIN de Gerente
2. Accede a **Configuración** para:
   - Crear/editar usuarios
   - Ajustar stock mínimo e alertas
   - Gestionar categorías
3. Exporta datos en **Sincronización** → Backup
4. Importa datos desde otro dispositivo

---

## 📊 Modelo de Datos

### Tiendas IndexedDB

**usuarios**
```javascript
{
  id: 1,
  nombre: "Juan García",
  rol: "gerente|tecnico_techo|tecnico_electrico",
  pin_hash: "hash_sha256",
  activo: true,
  pinCambiado: false
}
```

**categorias**
```javascript
{
  id: 1,
  nombre: "Techo",
  descripcion: "Insumos para instalación en techo",
  color: "#00c2ff"
}
```

**insumos**
```javascript
{
  id: 1,
  nombre: "Panel Solar 400W",
  categoria: 1,
  seccion: "Techo",
  unidad: "unidad",
  actual: 15,
  minima: 5,
  maxima: 50,
  precio: 250.00,
  notas: "Marca XYZ, modelo ABC"
}
```

**entradas**
```javascript
{
  id: 1,
  insumo: 1,
  cantidad: 10,
  fecha: "2026-05-12",
  usuario: 1,
  notas: "Llegó pedido del proveedor"
}
```

**salidas**
```javascript
{
  id: 1,
  insumo: 1,
  cantidad: 2,
  fecha: "2026-05-12",
  usuario: 1,
  proyecto: "Casa Solar Centro",
  notas: "Instalación completada",
  pendiente: false
}
```

---

## 🔐 Seguridad

- **PIN de 4 dígitos** protege el acceso (hash SHA-256 con salt)
- **Datos locales**: Todo se almacena en IndexedDB del navegador (no sube a servidores)
- **Roles y permisos**: El sistema respeta el rol asignado en cada acción
- **Sin dependencias externas**: Código 100% vanilla, reduciendo vectores de ataque

**Nota:** Para producción, considera:
- Usar HTTPS
- Implementar autenticación en servidor
- Encriptar backups exportados

---

## 🛠️ Desarrollo

### Estructura de módulos

Cada módulo sigue este patrón:

```javascript
// Importa dependencias
import { getAll, put } from '../db.js';
import { icon, toast } from '../utils.js';

// Funciones exportadas (públicas)
export async function renderDashboard() { ... }
export function openSeccion(sec) { ... }

// Funciones internas (privadas)
function helperFunction() { ... }
```

### Agregar un nuevo módulo

1. Crea `modules/nueva-funcion.js`
2. Define funciones públicas con `export`
3. Importa en el correspondiente archivo que la use
4. Mapea funciones en `app.js` si necesitas onclick handlers

### Ejecutar con servidor local

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