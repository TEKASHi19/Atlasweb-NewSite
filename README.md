# Atlas Web — sitio

Sitio de [atlasweb.com.mx](https://atlasweb.com.mx). HTML, CSS y JavaScript sin framework ni paso de build.

## Estructura

- `index.html` — la página
- `styles.css` — estilos
- `main.js` — menú en píldora, preguntas frecuentes, formulario (abre WhatsApp), efectos de scroll y brillo del arco (WebGL)
- `assets/` — imágenes
- `favicon.svg` — favicon provisional (reemplazar cuando esté el logo)

## Ver en local

```bash
npx serve .
```

## Desplegar en Vercel

Importar el repo en Vercel con el preset **Other**, sin build command y con output directory `.` (la raíz). Cada push a `main` despliega solo.

## Pendientes

- Capturas reales de los proyectos (hoy son marcadores `[Captura de…]`)
- Logo definitivo y favicon
- Correo, Instagram y aviso de privacidad en el footer
- Forma de pago en el FAQ
- Testimonio aprobado por Alejandro Carreón
