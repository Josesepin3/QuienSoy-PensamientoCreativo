const QUIZ_CONFIG = {
  timePerQuestion: 20,

  questions: [
    {
      question: "¿Cuál es mi color favorito?",
      options: ["Azul", "Verde", "Rojo", "Blanco"]
    },
    {
      question: "¿Pizza o tacos?",
      options: ["Pizza", "Tacos", "Los dos", "Ninguno"]
    },
    {
      question: "¿Soy de día o de noche?",
      options: ["Mañana", "Tarde", "Noche", "Madrugada"]
    },
    {
      question: "¿Cuántas horas duermo?",
      options: ["Menos de 5", "5-7", "7-9", "Mas de 9"]
    },
    {
      question: "¿Uso lentes?",
      options: ["Si", "No"]
    },
    {
      question: "¿Qué música escucho?",
      options: ["Pop", "Rock", "Reggaeton", "Otra"]
    },
    {
      question: "¿Cuál es mi comida favorita?",
      options: ["Tacos", "Pizza", "Sushi", "Hamburguesa"]
    },
    {
      question: "¿Soy organized o caótico?",
      options: ["Organizado", "Caótico", "Un poco de ambos"]
    },
    {
      question: "¿Cuál es mi pasatiempo favorito?",
      options: ["Videojuegos", "Leer", "Deporte", "Musica"]
    },
    {
      question: "¿Cuál es mi miedo mayor?",
      options: ["Alturas", "Oscuridad", "Hablar en publico", "Otros"]
    }
  ]
};

const TOTAL_QUESTIONS = QUIZ_CONFIG.questions.length;
