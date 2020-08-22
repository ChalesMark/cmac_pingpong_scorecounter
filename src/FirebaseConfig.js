import * as fb from "firebase";
import "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDH5z9DSBmCi2ssLd7-Hmz1u7HLKKujds8",
  authDomain: "cmac-counter.firebaseapp.com",
  databaseURL: "https://cmac-counter.firebaseio.com",
  projectId: "cmac-counter",
  storageBucket: "cmac-counter.appspot.com",
  messagingSenderId: "491636369225",
  appId: "1:491636369225:web:c0d87040d31417f7669c98",
};

const app = fb.initializeApp(firebaseConfig);

export const firebase = fb;
export const firestore = fb.firestore(app);
export const auth = app.auth();
