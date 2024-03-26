importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-messaging-compat.js')

const firebaseConfig = {
  apiKey: "AIzaSyBLyi67O-AUbdXZK1wdM0F5Vvi_couK6u0",
  authDomain: "projectdemo-ad6dd.firebaseapp.com",
  databaseURL: "https://projectdemo-ad6dd-default-rtdb.firebaseio.com",
  projectId: "projectdemo-ad6dd",
  storageBucket: "projectdemo-ad6dd.appspot.com",
  messagingSenderId: "859784439972",
  appId: "1:859784439972:web:5c736ee89e4843c5c85e31",
  measurementId: "G-RGPXLLCE1Z"
};

const app = firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload) {
  if (!payload.hasOwnProperty('notification')) {
      const notificationTitle = payload.data.title
      const notificationOptions = {
          body: payload.data.body,
          icon: payload.data.icon,
          image: payload.data.image
      }
      self.registration.showNotification(notificationTitle, notificationOptions);
      self.addEventListener('notificationclick', function (event) {
          const clickedNotification = event.notification
          clickedNotification.close();
          event.waitUntil(
              clients.openWindow(payload.data.click_action)
          )
      })
  }
})
