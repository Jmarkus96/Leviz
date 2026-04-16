// Contenido demostrativo del ebook. Estructura:
//   CHAPTERS[] -> { id, title, subtitle, emoji, pages[] }
//   page.type: "reading" | "quiz" | "fill" | "flash"
//
// En las páginas de lectura, etiqueta <w data-es="traducción">palabra</w>
// para que el lector muestre un tooltip con la traducción al hacer tap.

export const CHAPTERS = [
  {
    id: "ch1",
    title: "Greetings & Introductions",
    subtitle: "Saludos y presentaciones",
    emoji: "👋",
    pages: [
      {
        type: "reading",
        heading: "Saying hello",
        html: `
          <p><w data-es="Hola">Hello</w>! My <w data-es="nombre">name</w> is <b>Ana</b>.
          I <w data-es="soy">am</w> from <b>Mexico</b>. <w data-es="¿Y tú?">And you?</w></p>
          <p>When you meet someone, you can say:</p>
          <ul>
            <li><b>Hi!</b> — <i>Hola (informal)</i></li>
            <li><b>Good morning!</b> — <i>Buenos días</i></li>
            <li><b>Nice to meet you.</b> — <i>Encantado/a de conocerte</i></li>
          </ul>
          <p class="tip">💡 Toca las palabras <w data-es="resaltadas">highlighted</w> para ver la traducción.</p>
        `
      },
      {
        type: "reading",
        heading: "Asking names",
        html: `
          <p>To ask someone's name, you say:</p>
          <p class="dialog"><b>A:</b> <w data-es="¿Cuál es tu nombre?">What is your name?</w><br>
          <b>B:</b> My <w data-es="nombre">name</w> is Carlos. <w data-es="¿Cuál es el tuyo?">What's yours?</w><br>
          <b>A:</b> I'm Sofía. <w data-es="Encantada">Nice to meet you</w>.</p>
          <p>Short forms are very common in spoken English:</p>
          <ul>
            <li><b>I am → I'm</b></li>
            <li><b>You are → You're</b></li>
            <li><b>What is → What's</b></li>
          </ul>
        `
      },
      {
        type: "quiz",
        title: "Quiz: Saludos",
        questions: [
          {
            q: "¿Cómo saludas por la mañana?",
            options: ["Good night", "Good morning", "Good evening", "Good bye"],
            answer: 1,
            explain: "«Good morning» se usa hasta el mediodía."
          },
          {
            q: "Traduce: «Encantado de conocerte».",
            options: ["See you later", "Nice to meet you", "How are you?", "Thank you"],
            answer: 1,
            explain: "«Nice to meet you» es la fórmula estándar al conocer a alguien."
          },
          {
            q: "¿Cuál es la contracción de «I am»?",
            options: ["Im", "I'm", "Am'I", "I're"],
            answer: 1,
            explain: "Se escribe con apóstrofo: I'm."
          },
          {
            q: "«What is your name?» significa…",
            options: ["¿De dónde eres?", "¿Cómo estás?", "¿Cuál es tu nombre?", "¿Cuántos años tienes?"],
            answer: 2,
            explain: "Literal: «¿Cuál es tu nombre?»."
          }
        ]
      },
      {
        type: "fill",
        title: "Completa los huecos",
        items: [
          { before: "Hello! My ", blank: "name", after: " is Ana.", hint: "palabra: «nombre»" },
          { before: "I ", blank: "am", after: " from Spain.", hint: "verbo ser (1ª persona)" },
          { before: "Nice ", blank: "to", after: " meet you.", hint: "preposición" }
        ]
      },
      {
        type: "flash",
        title: "Flashcards del capítulo",
        cards: [
          { en: "hello", es: "hola" },
          { en: "good morning", es: "buenos días" },
          { en: "good evening", es: "buenas tardes/noches" },
          { en: "name", es: "nombre" },
          { en: "nice to meet you", es: "encantado de conocerte" },
          { en: "how are you?", es: "¿cómo estás?" },
          { en: "fine, thanks", es: "bien, gracias" },
          { en: "goodbye", es: "adiós" }
        ]
      }
    ]
  },

  {
    id: "ch2",
    title: "Present Simple",
    subtitle: "El presente simple",
    emoji: "🕒",
    pages: [
      {
        type: "reading",
        heading: "Daily routines",
        html: `
          <p>Every day Luis <w data-es="se despierta">wakes up</w> at 7 a.m.
          He <w data-es="desayuna">has breakfast</w>, <w data-es="lee">reads</w> the news
          and <w data-es="va">goes</w> to work.</p>
          <p>The present simple is used for <b>routines</b>, <b>habits</b> and <b>facts</b>.</p>
          <table class="rules">
            <tr><th>Sujeto</th><th>Verbo</th></tr>
            <tr><td>I / you / we / they</td><td><b>work</b></td></tr>
            <tr><td>he / she / it</td><td><b>works</b> (añade -s)</td></tr>
          </table>
        `
      },
      {
        type: "reading",
        heading: "Questions & negatives",
        html: `
          <p>Para preguntar usamos <b>do / does</b>:</p>
          <p class="dialog"><b>A:</b> <w data-es="¿Tú trabajas los sábados?">Do you work on Saturdays?</w><br>
          <b>B:</b> <w data-es="No, no lo hago">No, I don't</w>. I <w data-es="descanso">rest</w>.</p>
          <p>Para negar, <b>don't</b> (I/you/we/they) o <b>doesn't</b> (he/she/it):</p>
          <ul>
            <li>She <b>doesn't</b> drink coffee.</li>
            <li>They <b>don't</b> live here.</li>
          </ul>
        `
      },
      {
        type: "quiz",
        title: "Quiz: Presente simple",
        questions: [
          {
            q: "Completa: «She ___ English every day».",
            options: ["study", "studies", "studys", "studing"],
            answer: 1,
            explain: "3ª persona singular → añade -es cuando termina en consonante + y."
          },
          {
            q: "¿Cuál es la forma negativa correcta?",
            options: ["He no work.", "He doesn't works.", "He doesn't work.", "He don't work."],
            answer: 2,
            explain: "doesn't + infinitivo (sin -s)."
          },
          {
            q: "Traduce: «Ellos viven en Madrid».",
            options: ["They lives in Madrid.", "They live in Madrid.", "They living in Madrid.", "They is live in Madrid."],
            answer: 1,
            explain: "Sujeto plural → verbo sin -s."
          },
          {
            q: "Pregunta correcta para «you / speak / French»:",
            options: ["Do you speak French?", "You do speak French?", "Does you speak French?", "Are you speak French?"],
            answer: 0,
            explain: "Do + sujeto + infinitivo."
          }
        ]
      },
      {
        type: "fill",
        title: "Completa los huecos",
        items: [
          { before: "She ", blank: "works", after: " in a hospital.", hint: "work + s (3ª persona)" },
          { before: "I ", blank: "don't", after: " like coffee.", hint: "contracción de do + not" },
          { before: "", blank: "Does", after: " he play football?", hint: "auxiliar para he/she/it" }
        ]
      },
      {
        type: "flash",
        title: "Verbos de rutina",
        cards: [
          { en: "to wake up", es: "despertarse" },
          { en: "to have breakfast", es: "desayunar" },
          { en: "to work", es: "trabajar" },
          { en: "to study", es: "estudiar" },
          { en: "to read", es: "leer" },
          { en: "to drink", es: "beber" },
          { en: "to live", es: "vivir" },
          { en: "to rest", es: "descansar" }
        ]
      }
    ]
  },

  {
    id: "ch3",
    title: "Everyday Vocabulary",
    subtitle: "Vocabulario cotidiano",
    emoji: "🛒",
    pages: [
      {
        type: "reading",
        heading: "At the supermarket",
        html: `
          <p>On Saturdays I go to the <w data-es="supermercado">supermarket</w>.
          I buy <w data-es="pan">bread</w>, <w data-es="leche">milk</w>, <w data-es="frutas">fruit</w>
          and <w data-es="verduras">vegetables</w>.</p>
          <p>Useful phrases:</p>
          <ul>
            <li><b>How much is it?</b> — <i>¿Cuánto cuesta?</i></li>
            <li><b>I'd like…</b> — <i>Me gustaría…</i></li>
            <li><b>Can I pay by card?</b> — <i>¿Puedo pagar con tarjeta?</i></li>
          </ul>
        `
      },
      {
        type: "reading",
        heading: "Colors & numbers",
        html: `
          <p>Basic <w data-es="colores">colors</w>: <b>red</b>, <b>blue</b>, <b>green</b>,
          <b>yellow</b>, <b>black</b>, <b>white</b>.</p>
          <p>Numbers 1–10: one, two, three, four, five, six, seven, eight, nine, ten.</p>
          <p>From 20: twenty, thirty, forty, fifty… <br>
          Combine with a hyphen: <b>twenty-one</b> (21), <b>forty-five</b> (45).</p>
        `
      },
      {
        type: "quiz",
        title: "Quiz: Vocabulario",
        questions: [
          {
            q: "¿Cómo se dice «verduras» en inglés?",
            options: ["fruits", "vegetables", "bread", "meat"],
            answer: 1,
            explain: "vegetables = verduras. fruits = frutas."
          },
          {
            q: "«How much is it?» significa…",
            options: ["¿Cuánto tiempo?", "¿Cuánto cuesta?", "¿Cuántos hay?", "¿Dónde está?"],
            answer: 1,
            explain: "Se usa para preguntar el precio."
          },
          {
            q: "¿Cuál NO es un color?",
            options: ["red", "green", "seven", "yellow"],
            answer: 2,
            explain: "«seven» es el número 7."
          },
          {
            q: "Escribe 45 con palabras:",
            options: ["four-five", "forty five", "forty-five", "fourty-five"],
            answer: 2,
            explain: "Se escribe con guion: forty-five (ojo: NO «fourty»)."
          }
        ]
      },
      {
        type: "flash",
        title: "Flashcards: Compras y colores",
        cards: [
          { en: "bread", es: "pan" },
          { en: "milk", es: "leche" },
          { en: "fruit", es: "fruta" },
          { en: "vegetables", es: "verduras" },
          { en: "red", es: "rojo" },
          { en: "blue", es: "azul" },
          { en: "green", es: "verde" },
          { en: "yellow", es: "amarillo" }
        ]
      }
    ]
  },

  {
    id: "ch4",
    title: "Past Tense Stories",
    subtitle: "Historias en pasado",
    emoji: "📖",
    pages: [
      {
        type: "reading",
        heading: "A short trip",
        html: `
          <p>Last <w data-es="verano">summer</w> I <w data-es="viajé">traveled</w> to London.
          I <w data-es="visité">visited</w> many museums and I <w data-es="comí">ate</w>
          fish and chips by the river.</p>
          <p>The trip <w data-es="fue">was</w> amazing, but the weather
          <w data-es="no fue">wasn't</w> great!</p>
        `
      },
      {
        type: "reading",
        heading: "Regular vs irregular",
        html: `
          <p>Los verbos regulares añaden <b>-ed</b>:</p>
          <ul>
            <li>work → work<b>ed</b></li>
            <li>visit → visit<b>ed</b></li>
            <li>travel → travel<b>ed</b></li>
          </ul>
          <p>Los irregulares cambian su forma (hay que memorizarlos):</p>
          <ul>
            <li>go → <b>went</b></li>
            <li>eat → <b>ate</b></li>
            <li>be → <b>was / were</b></li>
            <li>see → <b>saw</b></li>
          </ul>
        `
      },
      {
        type: "reading",
        heading: "Negatives in the past",
        html: `
          <p>En negativo y preguntas usamos <b>didn't</b> / <b>did</b> + infinitivo:</p>
          <ul>
            <li>I <b>didn't go</b> to the party. — <i>No fui a la fiesta.</i></li>
            <li><b>Did</b> you <b>see</b> the film? — <i>¿Viste la película?</i></li>
          </ul>
          <p class="tip">💡 Con «did/didn't» el verbo vuelve a su forma base.</p>
        `
      },
      {
        type: "quiz",
        title: "Quiz: Pasado simple",
        questions: [
          {
            q: "Pasado de «go»:",
            options: ["goed", "gone", "went", "goes"],
            answer: 2,
            explain: "«go» es irregular: went."
          },
          {
            q: "Forma negativa correcta:",
            options: ["I didn't went.", "I no went.", "I didn't go.", "I don't went."],
            answer: 2,
            explain: "didn't + infinitivo."
          },
          {
            q: "Pasado regular de «visit»:",
            options: ["visitted", "visited", "visit", "visiting"],
            answer: 1,
            explain: "Añade -ed: visited (una sola t)."
          },
          {
            q: "«She ___ my friend in 2010».",
            options: ["was", "were", "is", "been"],
            answer: 0,
            explain: "Sujeto singular → was."
          }
        ]
      },
      {
        type: "fill",
        title: "Completa los huecos",
        items: [
          { before: "I ", blank: "went", after: " to London last year.", hint: "pasado irregular de «go»" },
          { before: "She ", blank: "didn't", after: " like the movie.", hint: "negación en pasado (contracción)" },
          { before: "We ", blank: "were", after: " very tired.", hint: "pasado del verbo to be (plural)" }
        ]
      },
      {
        type: "flash",
        title: "Verbos en pasado",
        cards: [
          { en: "went", es: "fui / fue (go)" },
          { en: "ate", es: "comí / comió (eat)" },
          { en: "saw", es: "vi / vio (see)" },
          { en: "was", es: "fui / era (be — sing.)" },
          { en: "were", es: "fueron / éramos (be — pl.)" },
          { en: "visited", es: "visité / visitó" },
          { en: "traveled", es: "viajé / viajó" },
          { en: "didn't", es: "no (aux. pasado)" }
        ]
      }
    ]
  }
];
