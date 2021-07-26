import firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
  apiKey: "AIzaSyA5XSRWFHjl_FE9nXrOhfiFXudV2k8xtxw",
  authDomain: "booksantaapp-f590a.firebaseapp.com",
  projectId: "booksantaapp-f590a",
  storageBucket: "booksantaapp-f590a.appspot.com",
  messagingSenderId: "313267159471",
  appId: "1:313267159471:web:796c7ee15372773ced2f5a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
