const QUIZ_CONFIG = {
  timePerQuestion: 20,

  questions: [
    {
      question: "¿Cuál es mi color favorito?",
      options: ["Azul", "Verde", "Rojo", "Negro"]
    },
    {
      question: "¿Cuál es mi comida favorita?",
      options: ["Pizza", "Tacos", "Sushi", "Hamburguesa", "Pasta", "Pollo"]
    },
    {
      question: "¿Soy de día o de noche?",
      options: ["Madrugador", "Tarde", "Nocturno", "Madrugada"]
    },
    {
      question: "¿Cuántas horas duermo?",
      options: ["Menos de 5", "5-7", "7-9", "Mas de 9"]
    },
    {
      question: "¿Qué estudio?",
      options: ["Sistemas/Software", "Electrónica", "Mecánica", "Otra ingeniería"]
    },
    {
      question: "¿Qué música escucho?",
      options: ["Rock", "Pop", "Reggaeton", "Un poco de todo"]
    },
    {
      question: "¿Cuál es mi pasatiempo favorito?",
      options: ["Videojuegos", "Leer", "Deporte", "Musica"]
    },
    {
      question: "¿Cómo describirías mi personalidad?",
      options: ["Organizado", "Caótico", "Relajado", "Impulsivo"]
    },
    {
      question: "¿Cómo aprendo mejor?",
      options: ["Videos/Tutoriales", "Lectura", "Práctica", "Conversando"]
    },
    {
      question: "¿Cuál es mi mayor miedo?",
      options: ["Alturas", "Oscuridad", "La muerte", "Hablar en público"]
    }
  ]
};

const TOTAL_QUESTIONS = QUIZ_CONFIG.questions.length;
