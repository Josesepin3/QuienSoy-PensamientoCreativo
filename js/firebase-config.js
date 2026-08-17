import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getDatabase, ref, set, get, update, onValue, push, remove, onDisconnect } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAE4mQy1TM6B5xdZwNTnjLPQI7-69KdD7o",
  authDomain: "quiensoypensamientocreativo.firebaseapp.com",
  databaseURL: "https://quiensoypensamientocreativo-default-rtdb.firebaseio.com",
  projectId: "quiensoypensamientocreativo",
  storageBucket: "quiensoypensamientocreativo.firebasestorage.app",
  messagingSenderId: "583211445344",
  appId: "1:583211445344:web:bd60c79166c4a45bd56705",
  measurementId: "G-CQQWTPQEMY"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, get, update, onValue, push, remove, onDisconnect };
