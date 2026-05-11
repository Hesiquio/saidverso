# Cipher Quest 🤖

Juego de lógica y criptografía estilo retro desarrollado con Phaser 3 y Supabase.

## Instrucciones Rápidas

1. **Base de Datos**: 
   - Ve a tu proyecto en [Supabase](https://app.supabase.com).
   - Abre el **SQL Editor**.
   - Copia el contenido de el archivo `setup.sql` de esta carpeta y ejecútalo.
   
2. **Ejecutar el juego**:
   - Simplemente abre el archivo `index.html` en tu navegador.
   - O usa un servidor local como el de VS Code (Live Server) para una mejor experiencia.

3. **Cómo jugar**:
   - Usa las **flechas del teclado** o el **D-Pad táctil** en pantalla.
   - Debes recolectar las letras en el orden correcto de la palabra objetivo, pero ¡cuidado! Las letras en el laberinto están cifradas.
   - Si la pista dice `César +1`, y necesitas una `R`, busca la letra `S` en el laberinto.
   - Evita al Centinela Rojo que te persigue.

## Configuración Técnica
- **Motor**: Phaser 3 (Arcade Physics).
- **Backend**: Supabase (Tablas `niveles` y `rankings`).
- **Persistencia**: LocalStorage para progreso rápido y Supabase para el Ranking Global.
