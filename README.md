# 🤖 SaidVerso — Explorador Criptográfico

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://saidverso.vercel.app)
[![Phaser 3](https://img.shields.io/badge/Engine-Phaser_3-8200f5?style=for-the-badge&logo=phaser)](https://phaser.io)
[![Supabase](https://img.shields.io/badge/Backend-Supabase-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Capacitor](https://img.shields.io/badge/Mobile-Capacitor-119eff?style=for-the-badge&logo=capacitor)](https://capacitorjs.com)

**SaidVerso** es una experiencia educativa retro-futurista diseñada para enseñar lógica y criptografía a niños (y no tan niños). Sumérgete en un laberinto digital, descifra códigos en tiempo real y protege la información mientras escapas de los centinelas del sistema.

---

## 🚀 Características Principales

*   **🕹️ Mecánica de Juego Única**: Recolecta letras cifradas para formar palabras. ¿La pista dice `César +1`? Entonces la letra `S` en el laberinto es en realidad una `R`.
*   **🌌 Doble Plataforma**:
    *   **Web**: Optimizado para navegadores con resolución 800x600.
    *   **Mobile**: Versión nativa para Android con controles táctiles y optimización de pantalla vertical (450x800).
*   **🛒 Tienda de Cyber-Poderes**:
    *   ⭐ **Estrella**: Neutraliza centinelas.
    *   👻 **Fantasma**: Atraviesa paredes.
    *   ⚡ **Velocidad**: Incrementa el rendimiento del sistema.
    *   🔑 **Cripto-Llave**: Hackea cualquier letra (todas sirven).
    *   👁️ **Invisible**: Evita el rastreo de los centinelas.
*   **🏆 Ranking Global**: Compite con exploradores de todo el mundo gracias a la integración con **Supabase**.
*   **🌿 Salud Digital**: Sistema de pausas saludables integrado para fomentar buenos hábitos de juego.

---

## 🛠️ Tecnologías

*   **Frontend**: Phaser 3 (Arcade Physics).
*   **Lenguaje**: JavaScript (ES6+).
*   **Backend**: Supabase (PostgreSQL + Realtime).
*   **Despliegue**: Vercel (Web) & Capacitor (Android).

---

## 📦 Estructura del Proyecto

```text
├── android/            # Proyecto nativo para Android (Capacitor)
├── www/                # Versión optimizada para Mobile (450x800)
├── www-web/            # Versión optimizada para Web (800x600)
├── scripts/            # Utilidades de desarrollo y base de datos
│   ├── setup.sql       # Esquema de la base de datos
│   └── populate.js     # Script para cargar niveles
├── vercel.json         # Configuración de despliegue web
└── capacitor.config.json
```

---

## 🛠️ Instalación y Configuración

### 1. Preparación de la Base de Datos
1. Crea un proyecto en [Supabase](https://app.supabase.com).
2. Ejecuta el contenido de `scripts/setup.sql` en el **SQL Editor**.
3. (Opcional) Ejecuta `node scripts/populate_levels.js` para cargar los niveles iniciales.

### 2. Configuración del Cliente
Asegúrate de configurar tus credenciales de Supabase en `js/database.js` dentro de las carpetas `www` y `www-web`.

### 3. Ejecución
*   **Web**: Abre `www-web/index.html` o usa un Live Server.
*   **Mobile**: 
    ```bash
    npx cap sync
    npx cap open android
    ```

---

## 🎮 Cómo Jugar

1. **Identifícate**: El sistema necesita tu nombre de explorador para guardar tu racha.
2. **Descifra**: Mira la regla criptográfica en el HUD (ej: `REGLA: +1`).
3. **Recolecta**: Busca las letras en el orden correcto. Si la palabra es `HOLA` y la regla es `+1`, debes buscar `I-P-M-B`.
4. **Sobrevive**: Evita al Centinela Rojo. Si te atrapa, perderás una vida (¡puedes comprar más en la tienda!).

---

## 👤 Autor

Desarrollado con ❤️ por **SaidVerso**. 
*Explorando los límites de la criptografía y la educación.*

---

© 2026 SaidVerso — Licencia MIT.
