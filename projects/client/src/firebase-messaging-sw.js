importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyBG-_zw6_S9p1pirTgBWSpzaLmRzLiBh2Q",
    authDomain: "utilities-counter.firebaseapp.com",
    projectId: "utilities-counter",
    storageBucket: "utilities-counter.appspot.com",
    messagingSenderId: "268930229420",
    appId: "1:268930229420:web:f18eac3a3da51d441feb09",
    measurementId: "G-WGF4MBBCQX"
});

if (firebase.messaging.isSupported()) {
    const messaging = !firebase.apps.length
        ? firebase.initializeApp(firebaseConfig).messaging()
        : firebase.app().messaging();
}