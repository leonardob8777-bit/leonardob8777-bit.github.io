# LB — app para iPhone

App nativa que muestra el sitio a pantalla completa. Se compila **en
GitHub, sin necesidad de tener una Mac**, y se firma después con KSign.

---

## 🚀 Cómo generar el .ipa

1. Subí los cambios (GitHub Desktop → **Push origin**).
2. Entrá al repo en GitHub → pestaña **Actions**.
3. Elegí **Build iOS app (.ipa)** → botón **Run workflow**.
4. Esperá 3–5 minutos (la primera vez tarda un poco más).
5. Cuando termine, abajo de todo aparece **Artifacts** →
   descargá **LB-unsigned-ipa**.
6. Descomprimí el `.zip`: adentro está `LB-unsigned.ipa`.

## ✍️ Cómo firmarlo

Igual que cualquier otro IPA del sitio:

1. Pasá el `.ipa` a tu iPhone (AirDrop, Telegram, iCloud…).
2. Abrí **KSign** → elegí el archivo.
3. Seleccioná tu certificado → **Sign** → **Install**.

Si querés repartirla desde tu sitio, poné el `.ipa` firmado en `apps/`
y agregá su tarjeta (ver el README principal, sección b).

---

## ✏️ Qué se puede cambiar

| Qué | Dónde |
|---|---|
| La página que carga | `Sources/Config.swift` → `sitio` |
| Colores de fondo y marca | `Sources/Config.swift` |
| Qué dominios abren dentro de la app | `Sources/Config.swift` → `dominiosPropios` |
| Nombre debajo del ícono | `Sources/Info.plist` → `CFBundleDisplayName` |
| Ícono | `Resources/Assets.xcassets/AppIcon.appiconset/icon-1024.png` |
| Versión | `project.yml` → `MARKETING_VERSION` |

---

## ⚠️ Detalle importante del código

iOS **no permite instalar perfiles de configuración (`.mobileconfig`)
desde dentro de una app** — solo funcionan abiertos en Safari. Lo mismo
con los enlaces `itms-services://`.

Por eso `WebViewController.swift` detecta esos enlaces y los manda
afuera con `UIApplication.open`. **Si se sacara esa parte, los botones
principales del sitio dejarían de funcionar dentro de la app.**

Los enlaces a otros dominios (Telegram, MediaFire, KravaSign) también
se abren afuera, así se abren en su app nativa si está instalada.

---

## 📁 Estructura

```
ios-app/
├── project.yml                 → receta del proyecto (XcodeGen)
├── Sources/
│   ├── AppDelegate.swift       → arranque
│   ├── Config.swift            → ⚙️ lo que se edita
│   ├── WebViewController.swift → la pantalla y su lógica
│   └── Info.plist              → datos de la app
└── Resources/
    └── Assets.xcassets/        → ícono y color de arranque
```

No hay archivo `.xcodeproj` guardado: lo genera **XcodeGen** en cada
compilación a partir de `project.yml`. Es más fácil de leer y no se
rompe al editarlo.
