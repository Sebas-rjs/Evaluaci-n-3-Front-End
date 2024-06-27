import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, deleteDoc, getDoc, updateDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyALLBXvvO9y5NfelQm8kZxzQmQ0NTqIvCA",
    authDomain: "proyectop-e1f5b.firebaseapp.com",
    projectId: "proyectop-e1f5b",
    storageBucket: "proyectop-e1f5b.appspot.com",
    messagingSenderId: "610300032324",
    appId: "1:610300032324:web:e0927a4d079503446c1311"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


export const save = (entradas) => addDoc(collection(db, 'entradas'), entradas);
export const getData = (data) => onSnapshot(collection(db, 'entradas'), data);
export const remove = (id) => deleteDoc(doc(db, 'entradas', id));
export const selectOne = (id) => getDoc(doc(db, 'entradas', id));
export const edit = (id, entradas) => updateDoc(doc(db, 'entradas', id), entradas);
export const runExists = (run) => {
    const q = query(collection(db, "entradas"), where("run", "==", run));
    return getDocs(q).then((querySnapshot) => !querySnapshot.empty);
};
