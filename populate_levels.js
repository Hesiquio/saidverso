const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://cqsveyvxozegcxbidvqh.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxc3ZleXZ4b3plZ2N4YmlkdnFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUzODgxNywiZXhwIjoyMDk0MTE0ODE3fQ.Yk2Zr8chv6i00iwgs3Uqopj_IMP58BMHehqoKtItAh8";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const data = [
  // ... (Toda la lista de las 100 palabras con sus datos curiosos)
  { w: "ROBOT", t: "Los robots son máquinas que pueden realizar tareas automáticamente.", q: "¿Qué hace un robot?", o: ["Come plantas", "Realiza tareas solo", "Habla con animales"], c: 1 },
  { w: "NASA", t: "La NASA explora el espacio exterior buscando nuevos mundos.", q: "¿Qué busca la NASA?", o: ["Peces", "Nuevos mundos", "Tesoros piratas"], c: 1 },
  { w: "MARTE", t: "Marte es el cuarto planeta del sistema solar y es de color rojo.", q: "¿Qué número de planeta es Marte?", o: ["Primero", "Segundo", "Cuarto"], c: 2 },
  { w: "SOL", t: "El Sol es la estrella más cercana a la Tierra y nos da luz.", q: "¿Qué es el Sol?", o: ["Una estrella", "Un planeta", "Una roca"], c: 0 },
  { w: "LUNA", t: "La Luna no tiene luz propia, refleja la luz que le manda el Sol.", q: "¿De dónde viene la luz de la Luna?", o: ["De pilas", "Del Sol", "De las estrellas"], c: 1 },
  { w: "COHETE", t: "Los cohetes necesitan mucha fuerza para vencer la gravedad de la Tierra.", q: "¿Qué vencen los cohetes?", o: ["Al viento", "A la gravedad", "A los pájaros"], c: 1 },
  { w: "ASTRO", t: "Un astro es cualquier cuerpo natural que está en el cielo.", q: "¿Qué es un astro?", o: ["Un avión", "Un cuerpo del cielo", "Una nube"], c: 1 },
  { w: "ORBITA", t: "La órbita es el camino curvo que sigue un planeta alrededor del Sol.", q: "¿Qué es una órbita?", o: ["Un círculo", "Un camino curvo", "Una montaña"], c: 1 },
  { w: "COMETA", t: "Los cometas son bolas de hielo y polvo que viajan por el espacio.", q: "¿De qué están hechos los cometas?", o: ["De fuego", "De hielo y polvo", "De metal"], c: 1 },
  { w: "GALAXIA", t: "Una galaxia es un conjunto enorme de estrellas, planetas y gas.", q: "¿Qué es una galaxia?", o: ["Un país", "Un grupo de estrellas", "Un solo planeta"], c: 1 },
  { w: "SATELITE", t: "Los satélites giran alrededor de los planetas para enviar señales.", q: "¿Qué hacen los satélites?", o: ["Giran alrededor", "Se quedan quietos", "Vuelan al Sol"], c: 0 },
  { w: "ASTRONAUTA", t: "Los astronautas entrenan mucho para poder vivir en el espacio.", q: "¿Quién vive en el espacio?", o: ["Un buzo", "Un astronauta", "Un bombero"], c: 1 },
  { w: "TELESCOPIO", t: "El telescopio sirve para ver objetos que están muy lejos en el cielo.", q: "¿Para qué sirve?", o: ["Para oír", "Para ver de lejos", "Para oler"], c: 1 },
  { w: "GRAVEDAD", t: "La gravedad es la fuerza que nos mantiene pegados al suelo.", q: "¿Qué nos mantiene en el suelo?", o: ["El pegamento", "La gravedad", "El aire"], c: 1 },
  { w: "METEORO", t: "Un meteoro es un trozo de roca espacial que entra en la atmósfera.", q: "¿Qué es un meteoro?", o: ["Una nube roja", "Una roca espacial", "Un trueno"], c: 1 },
  { w: "PLANETA", t: "Existen 8 planetas principales en nuestro sistema solar.", q: "¿Cuántos planetas principales hay?", o: ["Cinco", "Ocho", "Diez"], c: 1 },
  { w: "ESTRELLA", t: "Las estrellas son bolas gigantes de gas que brillan mucho.", q: "¿De qué son las estrellas?", o: ["De gas", "De roca", "De agua"], c: 0 },
  { w: "ATMOSFERA", t: "La atmósfera es la capa de aire que protege a la Tierra.", q: "¿Qué es la atmósfera?", o: ["Capa de agua", "Capa de aire", "Capa de fuego"], c: 1 },
  { w: "UNIVERSO", t: "El universo es todo lo que existe: espacio, tiempo y materia.", q: "¿Qué es el universo?", o: ["Solo la Tierra", "Todo lo que existe", "Solo el Sol"], c: 1 },
  { w: "ECLIPSE", t: "Un eclipse ocurre cuando la Luna tapa la luz del Sol.", q: "¿Qué pasa en un eclipse?", o: ["Se apaga el Sol", "La Luna tapa al Sol", "Llueve mucho"], c: 1 },
  { w: "CHIP", t: "Un chip es un mini cerebro electrónico que controla aparatos.", q: "¿Qué es un chip?", o: ["Galleta", "Cerebro electrónico", "Batería"], c: 1 },
  { w: "BIT", t: "El bit es la unidad mínima de información: puede ser 0 o 1.", q: "¿Cuál es el valor de un bit?", o: ["1 o 2", "0 o 1", "A o B"], c: 1 },
  { w: "BYTE", t: "Un Byte es un grupo de 8 bits que forman un carácter.", q: "¿Cuántos bits tiene un byte?", o: ["Cuatro", "Ocho", "Diez"], c: 1 },
  { w: "CPU", t: "La CPU es la parte de la computadora que hace los cálculos.", q: "¿Qué hace la CPU?", o: ["Dibuja", "Hace cálculos", "Limpia"], c: 1 },
  { w: "RAM", t: "La memoria RAM guarda datos temporalmente para que todo sea rápido.", q: "¿Qué hace la RAM?", o: ["Guarda fotos", "Velocidad temporal", "Imprime"], c: 1 },
  { w: "DISCO", t: "El disco duro es donde se guardan permanentemente tus juegos y fotos.", q: "¿Dónde guardas tus fotos?", o: ["En el disco", "En la pantalla", "En el teclado"], c: 0 },
  { w: "MOUSE", t: "El mouse sirve para mover la flecha en la pantalla.", q: "¿Qué mueves con el mouse?", o: ["El cable", "La flecha", "La luz"], c: 1 },
  { w: "TECLADO", t: "Con el teclado escribimos las órdenes para la computadora.", q: "¿Para qué sirve?", o: ["Para pintar", "Para escribir", "Para jugar"], c: 1 },
  { w: "MONITOR", t: "El monitor muestra las imágenes que la computadora procesa.", q: "¿Qué vemos en el monitor?", o: ["Sonidos", "Imágenes", "Colores"], c: 1 },
  { w: "CABLE", t: "Los cables transportan la electricidad y los datos entre aparatos.", q: "¿Qué llevan los cables?", o: ["Agua", "Datos y energía", "Comida"], c: 1 },
  { w: "PLACA", t: "La placa base conecta todas las piezas de la computadora.", q: "¿Qué hace la placa base?", o: ["Conecta piezas", "Enfría", "Limpia"], c: 0 },
  { w: "FUENTE", t: "La fuente de poder da la energía eléctrica a la computadora.", q: "¿Qué da la fuente?", o: ["Internet", "Energía", "Papel"], c: 1 },
  { w: "VENTILADOR", t: "El ventilador evita que las piezas se calienten demasiado.", q: "¿Para qué sirve?", o: ["Para volar", "Para enfriar", "Para alumbrar"], c: 1 },
  { w: "PUERTO", t: "Un puerto es el lugar donde conectas cables como el USB.", q: "¿Qué es un puerto?", o: ["Lugar de conexión", "Un tornillo", "Un foco"], c: 0 },
  { w: "USB", t: "El USB es una forma estándar de conectar casi cualquier aparato.", q: "¿Qué es el USB?", o: ["Una batería", "Un conector", "Un juego"], c: 1 },
  { w: "WIFI", t: "El WiFi envía datos por el aire usando ondas invisibles.", q: "¿Cómo viaja el WiFi?", o: ["Por tubos", "Por el aire", "Por cables"], c: 1 },
  { w: "BATERIA", t: "La batería guarda energía para que uses tu móvil sin cables.", q: "¿Qué guarda la batería?", o: ["Agua", "Energía", "Fotos"], c: 1 },
  { w: "CHASIS", t: "El chasis es la caja que protege todas las piezas internas.", q: "¿Qué es el chasis?", o: ["El motor", "La caja protectora", "Un cable"], c: 1 },
  { w: "SENSOR", t: "Un sensor detecta cambios como el movimiento o la luz.", q: "¿Qué hace un sensor?", o: ["Detecta cambios", "Dibuja", "Canta"], c: 0 },
  { w: "PIXEL", t: "Un píxel es un cuadrito de color. Muchos forman una foto.", q: "¿Qué forma un píxel?", o: ["Un sonido", "Una foto", "Un cable"], c: 1 },
  { w: "WEB", t: "La web es una colección gigante de páginas con información.", q: "¿Qué es la web?", o: ["Un libro", "Páginas de internet", "Un video"], c: 1 },
  { w: "APP", t: "Una App es un programa hecho para hacer algo específico.", q: "¿Qué es una App?", o: ["Un teléfono", "Un programa", "Un juego físico"], c: 1 },
  { w: "LINK", t: "Un link es un puente que te lleva de una página a otra.", q: "¿Qué hace un link?", o: ["Te conecta", "Apaga la PC", "Imprime"], c: 0 },
  { w: "MAIL", t: "El mail es como una carta pero viaja por internet al instante.", q: "¿Qué es el mail?", o: ["Papel", "Correo electrónico", "Un dibujo"], c: 1 },
  { w: "CHAT", t: "Chatear es hablar con personas en tiempo real por internet.", q: "¿Qué es chatear?", o: ["Hablar online", "Dormir", "Comer"], c: 0 },
  { w: "LOG", t: "Un Log es un registro de todo lo que hace un programa.", q: "¿Qué es un Log?", o: ["Un registro", "Un error", "Un dibujo"], c: 0 },
  { w: "BUG", t: "Un Bug es un error en el código que hace que falle algo.", q: "¿Qué es un Bug?", o: ["Un bicho", "Un error de código", "Un premio"], c: 1 },
  { w: "CODE", t: "El código es el lenguaje que entienden las computadoras.", q: "¿Qué es el código?", o: ["Un dibujo", "Lenguaje de PC", "Un número"], c: 1 },
  { w: "JAVA", t: "Java es un lenguaje de programación muy famoso y potente.", q: "¿Qué es Java?", o: ["Café", "Lenguaje de PC", "Un país"], c: 1 },
  { w: "HTML", t: "HTML es el lenguaje que se usa para crear páginas web.", q: "¿Para qué sirve?", o: ["Para fotos", "Para páginas web", "Para música"], c: 1 },
  { w: "NUBE", t: "La nube guarda tus datos en computadoras lejanas y seguras.", q: "¿Qué hace la nube?", o: ["Llueve", "Guarda datos", "Vuela"], c: 1 },
  { w: "RED", t: "Una red es un grupo de computadoras que se hablan entre sí.", q: "¿Qué es una red?", o: ["Una telaraña", "PCs conectadas", "Un cable solo"], c: 1 },
  { w: "DATOS", t: "Los datos son la información que procesamos en el juego.", q: "¿Qué son los datos?", o: ["Letras solas", "Información", "Juguetes"], c: 1 },
  { w: "CLAVE", t: "Una clave secreta protege tus cuentas de personas malas.", q: "¿Para qué sirve?", o: ["Para entrar", "Para proteger", "Para jugar"], c: 1 },
  { w: "LOCK", t: "Bloquear (Lock) ayuda a que nadie use tu PC sin permiso.", q: "¿Qué hace Lock?", o: ["Bloquea", "Abre", "Pinta"], c: 0 },
  { w: "SPAM", t: "El Spam son mensajes molestos que no pediste recibir.", q: "¿Qué es el Spam?", o: ["Comida", "Mensajes molestos", "Premios"], c: 1 },
  { w: "SCAN", t: "Escanear es revisar un archivo buscando virus o errores.", q: "¿Qué es Scan?", o: ["Borrar", "Revisar", "Copiar"], c: 1 },
  { w: "SEND", t: "Enviar (Send) es mandar información a otro lugar.", q: "¿Qué es Send?", o: ["Recibir", "Mandar", "Guardar"], c: 1 },
  { w: "LOAD", t: "Cargar (Load) es traer datos desde el disco a la memoria.", q: "¿Qué es Load?", o: ["Descargar", "Cargar", "Borrar"], c: 1 },
  { w: "SAVE", t: "Guardar (Save) asegura que no pierdas tu progreso.", q: "¿Para qué sirve?", o: ["Para borrar", "Para no perder", "Para iniciar"], c: 1 },
  { w: "HEX", t: "Hexadecimal es un sistema que usa números y letras (A-F).", q: "¿Qué usa Hex?", o: ["Solo letras", "Números y letras", "Solo ceros"], c: 1 },
  { w: "BIN", t: "Binario es el sistema que usa solo 0 y 1.", q: "¿Qué números usa?", o: ["0 al 9", "0 y 1", "Solo 1"], c: 1 },
  { w: "LOGIC", t: "La lógica nos ayuda a pensar con orden y coherencia.", q: "¿Para qué sirve?", o: ["Pensar con orden", "Para cantar", "Para correr"], c: 0 },
  { w: "MATH", t: "Las matemáticas son la ciencia de los números y formas.", q: "¿Qué estudia?", o: ["Plantas", "Números", "Estrellas"], c: 1 },
  { w: "CIFRA", t: "Una cifra es un símbolo que representa un número.", q: "¿Qué es una cifra?", o: ["Una letra", "Un símbolo número", "Un dibujo"], c: 1 },
  { w: "SUMA", t: "Sumar es juntar dos o más cantidades en una sola.", q: "¿Qué es sumar?", o: ["Quitar", "Juntar", "Dividir"], c: 1 },
  { w: "RESTA", t: "Restar es quitar una cantidad de otra más grande.", q: "¿Qué es restar?", o: ["Añadir", "Quitar", "Juntar"], c: 1 },
  { w: "MULTY", t: "Multiplicar es sumar el mismo número varias veces.", q: "¿Qué es?", o: ["Sumar repetido", "Restar", "Dividir"], c: 0 },
  { w: "DIVID", t: "Dividir es repartir algo en partes iguales.", q: "¿Qué es?", o: ["Juntar", "Repartir", "Quitar"], c: 1 },
  { w: "CERO", t: "El cero representa la ausencia de cantidad.", q: "¿Qué vale el cero?", o: ["Nada/Ausencia", "Diez", "Mucho"], c: 0 },
  { w: "UNO", t: "El uno es la primera unidad de conteo.", q: "¿Qué sigue al cero?", o: ["Dos", "Uno", "Tres"], c: 1 },
  { w: "PAR", t: "Los números pares se pueden dividir exactamente en dos.", q: "¿Qué es un par?", o: ["Dividible por 2", "Impar", "Grande"], c: 0 },
  { w: "AREA", t: "El área mide cuánto espacio ocupa una superficie.", q: "¿Qué mide?", o: ["El peso", "La superficie", "El tiempo"], c: 1 },
  { w: "GRADO", t: "Los grados miden la temperatura o los ángulos.", q: "¿Qué miden?", o: ["El color", "Ángulos/Calor", "El agua"], c: 1 },
  { w: "PLANO", t: "Un plano es una superficie lisa que no tiene curvas.", q: "¿Qué es?", o: ["Una bola", "Superficie lisa", "Un cubo"], c: 1 },
  { w: "METRO", t: "El metro es la unidad básica para medir longitud.", q: "¿Qué mide?", o: ["El peso", "La longitud", "El tiempo"], c: 1 },
  { w: "KILO", t: "El kilo es la unidad básica para medir el peso.", q: "¿Qué mide?", o: ["La altura", "El peso", "El calor"], c: 1 },
  { w: "LITRO", t: "El litro se usa para medir líquidos como el agua.", q: "¿Qué mide?", o: ["Líquidos", "Sólidos", "Gases"], c: 0 },
  { w: "TIEMPO", t: "El tiempo mide la duración de las cosas (seg, min).", q: "¿Qué mide?", o: ["Distancia", "Duración", "Peso"], c: 1 },
  { w: "LOGO", t: "Un logo es un dibujo que representa a una empresa.", q: "¿Qué es?", o: ["Un juego", "Un dibujo marca", "Un cable"], c: 1 },
  { w: "VIDA", t: "La vida es lo que diferencia a animales y plantas de rocas.", q: "¿Quién tiene vida?", o: ["Piedras", "Plantas", "Nubes"], c: 1 },
  { w: "AGUA", t: "El agua es transparente, no tiene color ni olor.", q: "¿Cómo es el agua?", o: ["Roja", "Transparente", "Dulce"], c: 1 },
  { w: "AIRE", t: "El aire es una mezcla de gases que respiramos.", q: "¿Qué respiramos?", o: ["Agua", "Aire", "Tierra"], c: 1 },
  { w: "TIERRA", t: "La Tierra es nuestro hogar en el sistema solar.", q: "¿Qué es?", o: ["Un sol", "Un planeta", "Una luna"], c: 1 },
  { w: "FUEGO", t: "El fuego produce luz y calor por una reacción química.", q: "¿Qué produce?", o: ["Frío", "Luz y calor", "Agua"], c: 1 },
  { w: "PLANTA", t: "Las plantas fabrican su propio alimento con el Sol.", q: "¿De dónde sacan comida?", o: ["Del súper", "Del Sol", "Del aire solo"], c: 1 },
  { w: "ANIMAL", t: "Los animales son seres vivos que pueden moverse.", q: "¿Qué pueden hacer?", o: ["Moverse", "Ser rocas", "Ser fuego"], c: 0 },
  { w: "CELULA", t: "La célula es la unidad más pequeña de todo ser vivo.", q: "¿Qué es?", o: ["Un hueso", "Unidad de vida", "Un diente"], c: 1 },
  { w: "HUESO", t: "Los huesos forman el esqueleto que sostiene tu cuerpo.", q: "¿Para qué sirven?", o: ["Para ver", "Sostener el cuerpo", "Para oír"], c: 1 },
  { w: "ADN", t: "El ADN contiene las instrucciones de cómo eres tú.", q: "¿Qué contiene?", o: ["Comida", "Instrucciones de ti", "Agua"], c: 1 },
  { w: "GEN", t: "Los genes son partes del ADN que heredamos de padres.", q: "¿De dónde vienen?", o: ["Del espacio", "De los padres", "Del suelo"], c: 1 },
  { w: "CLIMA", t: "El clima es el estado del tiempo en un lugar largo tiempo.", q: "¿Qué es?", o: ["La lluvia de hoy", "Estado del tiempo", "Un mapa"], c: 1 },
  { w: "MAR", t: "El mar es una gran extensión de agua salada.", q: "¿Cómo es su agua?", o: ["Dulce", "Salada", "Ácida"], c: 1 },
  { w: "RIO", t: "Los ríos son corrientes de agua dulce que van al mar.", q: "¿A dónde van?", o: ["Al cielo", "Al mar", "A las casas"], c: 1 },
  { w: "LUZ", t: "La luz viaja más rápido que cualquier otra cosa.", q: "¿Qué tan rápida es?", o: ["Lenta", "Más rápida que todo", "Normal"], c: 1 },
  { w: "SONIDO", t: "El sonido viaja por el aire en forma de vibraciones.", q: "¿Cómo viaja?", o: ["Por cables", "Vibraciones aire", "Por la luz"], c: 1 },
  { w: "GAS", t: "El gas es un estado de la materia que no tiene forma.", q: "¿Qué es?", o: ["Sólido", "Un estado materia", "Agua"], c: 1 },
  { w: "LIQUID", t: "Los líquidos fluyen y toman la forma del recipiente.", q: "¿Qué hacen?", o: ["Se rompen", "Toman la forma", "Son duros"], c: 1 },
  { w: "SOLID", t: "Los sólidos son duros y mantienen su forma.", q: "¿Cómo son?", o: ["Blandos", "Duros", "Agua"], c: 1 },
  { w: "SAD", t: "SaidVerso es tu mundo de aprendizaje y exploración.", q: "¿Cómo se llama este juego?", o: ["SaidVerso", "Robot Game", "Mundo Pixel"], c: 0 }
];

// --- PLANTILLAS DE MUNDOS ---
const mazes = [
  // 1. Mundo Espacial (Abierto)
  [
    [1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,1,0,1,0,0,0,1],
    [1,1,1,0,1,0,1,0,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,0,1,1,1,0,1,1,1],
    [1,0,0,0,1,0,1,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1]
  ],
  // 2. Mundo Microchip (Pasillos estrechos)
  [
    [1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,1,0,1],
    [1,1,1,0,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,1,0,1],
    [1,1,1,0,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1]
  ],
  // 3. Mundo Red (Z-Zigzag)
  [
    [1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,1,0,0,1],
    [1,1,1,1,1,1,0,1,0,1,1],
    [1,0,0,0,0,0,0,0,0,0,1],
    [1,1,0,1,1,1,1,1,1,1,1],
    [1,0,0,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,1,0,0,1],
    [1,1,1,1,1,1,0,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1]
  ],
  // 4. Mundo Científico (Simétrico)
  [
    [1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,1,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1],
    [1,0,1,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,0,1,1,1,0,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,1,0,1],
    [1,0,1,0,1,0,1,0,1,0,1],
    [1,0,0,0,1,0,1,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1]
  ]
];

const niveles = data.map((item, index) => ({
  nombre: `Nivel ${index + 1}: ${item.w}`,
  config: {
    word: item.w,
    hint: `REGLA: SALTA 1 LETRA (A->B)`,
    shift: 1,
    maze: mazes[index % mazes.length], // ROTA EL MAPA CADA NIVEL
    learning: { text: item.t, question: item.q, options: item.o, correct: item.c }
  }
}));

async function upload() {
  console.log("🚀 Sincronizando SaidVerso Multi-Mundo...");
  await supabase.from('niveles').delete().neq('id', 0);
  const { error } = await supabase.from('niveles').insert(niveles);
  if (error) console.error("❌ Error:", error.message);
  else console.log("✅ SaidVerso tiene ahora 100 niveles con mapas rotativos.");
}

upload();
