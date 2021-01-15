importScripts('https://www.gstatic.com/firebasejs/4.9.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.9.1/firebase-messaging.js');
firebase.initializeApp({
  'messagingSenderId': '677218008910'
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    //console.log('[firebase-messaging-sw.js] Received background message ', payload);
	return self.registration.hideNotification();
});

self.addEventListener('install', function (event) {
    event.waitUntil(skipWaiting());
});

self.addEventListener('activate', function (event) {
    event.waitUntil(clients.claim());
});

self.addEventListener('push', function (event) {
	//console.log("event while pushing : ", event);
    var pushData = event.data.json();
	//console.log("push data notification : ", pushData);
	console.log("title : ", pushData.notification.title);
    try {
        var notificationData = pushData.data;
        console.log("firebase notification : ", notificationData);
        self.registration.showNotification(pushData.notification.title, notificationData);
    }
    catch (err) {
        console.log('Push error happened: ', err);
    }
});
