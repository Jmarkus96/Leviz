# Leviz — Ebook interactivo de inglés

Aplicación web **mobile-first** que simula un ebook para aprender inglés.
Sin dependencias, sin build step: HTML, CSS y JavaScript puro (módulos ES).

## Características

- 📖 Lector tipo libro con **swipe** entre páginas (táctil y teclado ← →).
- 🔤 Palabras resaltadas en los textos: **tócalas** para ver la traducción.
- 🧠 Ejercicios interactivos:
  - Quiz de **opción múltiple** con feedback inmediato y explicación.
  - **Completar espacios** (fill-in-the-blank) con validación tolerante.
  - **Flashcards** volteables (CSS 3D) con botones “Ya la sé” / “Repasar”.
- 📊 Panel de **progreso**: avance por capítulo, aciertos, vocabulario, racha de días.
- 🌓 Tema **claro / oscuro** (o automático según el sistema).
- 💾 Todo se guarda en `localStorage` — sin backend, sin cuentas.
- ♿ Accesible: teclado, `aria-live`, `prefers-reduced-motion`, áreas táctiles ≥ 44 px.

## Contenido demostrativo

4 capítulos con un total de 20+ páginas:

1. **Greetings & Introductions** — saludos y presentaciones.
2. **Present Simple** — presente simple, rutinas.
3. **Everyday Vocabulary** — compras, colores y números.
4. **Past Tense Stories** — pasado simple con relato corto.

## Cómo probar la app

Necesitas servirla por HTTP (los módulos ES no funcionan con `file://`).

```bash
cd Leviz
python3 -m http.server 8000
# luego abre http://localhost:8000
```

Alternativas:

```bash
npx serve .
# o
php -S localhost:8000
```

Para ver la versión mobile en un ordenador: abre Chrome → DevTools → **Device Toolbar**
(Cmd/Ctrl + Shift + M) y elige un preset tipo iPhone 14 Pro o Pixel 7.

## Estructura

```
Leviz/
├── index.html           # Shell con todas las vistas
├── css/
│   ├── styles.css       # Tokens, layout mobile-first, tema claro/oscuro
│   └── animations.css   # Transiciones entre vistas y páginas
├── js/
│   ├── app.js           # Router por hash, swipe, tooltips, init
│   ├── content.js       # Datos de los capítulos y ejercicios
│   ├── exercises.js     # Render de quiz, fill-blank y flashcards
│   └── progress.js      # Persistencia y estadísticas (localStorage)
└── assets/
    └── icons.svg        # Sprite SVG inline
```

## Añadir contenido

Abre `js/content.js` y añade capítulos o páginas siguiendo el formato existente:

```js
{
  type: "reading",
  heading: "Título de página",
  html: "Texto con <w data-es='traducción'>word</w> tappables."
}
```

Tipos de página: `reading`, `quiz`, `fill`, `flash`. Los detalles de cada uno
están comentados en el propio archivo.
