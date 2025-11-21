import {initializeApp} from "firebase/app";
import {getAnalytics, logEvent} from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBDZ3jf20jr3wemOZo5Je7VeT2A7HPeKgg",
    authDomain: "fck-generator.firebaseapp.com",
    projectId: "fck-generator",
    storageBucket: "fck-generator.appspot.com",
    messagingSenderId: "136535355379",
    appId: "1:136535355379:web:9dcfb9bf6b8f344a0fec86",
    measurementId: "G-99Q6HMSDHJ"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { analytics, logEvent };