// import the screens we want to navigate
import Start from './components/Start';
import Chat from './components/Chat';

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Firestore
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// Create the navigator
const Stack = createNativeStackNavigator();

// The app’s main Chat component that renders the chat UI
const App = () => {
  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCrpyHtB2gKaNTGgDXgtRiRKn4DhXakxYM",
    authDomain: "chatapp-c4f03.firebaseapp.com",
    projectId: "chatapp-c4f03",
    storageBucket: "chatapp-c4f03.appspot.com",
    messagingSenderId: "88121916846",
    appId: "1:88121916846:web:0aabcb35f7390f05bedc3f",
    measurementId: "G-Q6QJ1RPB1P"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen
          name="Chat"
        >
          {props => <Chat db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;