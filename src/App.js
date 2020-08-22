import React, { useState, useEffect } from "react";
import { Grid, Button } from "@material-ui/core";
import { Colors, Styles } from "./GlobalStyles";
import { firebase, firestore, auth } from "./FirebaseConfig";

import LoginScreen from "./LoginScreen";
import CounterSelection from "./CounterSelection";
import Counter from "./Counter";

import ExitToAppIcon from "@material-ui/icons/ExitToApp";
const logo = require("./Images/LogoWhite.png");

function App() {
  const [userID, setUserID] = useState(null); // The User id
  const [counter, setCounter] = useState(null);
  // Logs the user in
  const Login = (email, password) => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(function (user) {
        setUserID(auth.currentUser.uid);
      })
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;

        if (errorCode === "auth/wrong-password") {
          alert("Wrong password.");
        } else {
          alert(errorMessage);
        }
      });
  };

  // Registers the user into firebase
  const Register = async (email, password) => {
    await auth
      .createUserWithEmailAndPassword(email, password)
      .then(function (user) {
        Login(email, password);
      })
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;

        if (errorCode === "auth/weak-password") {
          alert("The password is too weak.");
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
  };

  const Logout = async () => {
    auth.signOut();
    setUserID(null);
  };

  // Checks for changes in the auth.
  // Mainly used to keep the user logged in if the page resets
  firebase.auth().onAuthStateChanged(function (u) {
    if (userID === null) {
      if (u) {
        setUserID(auth.currentUser.uid);
      } else {
        setUserID(null);
      }
    }
  });

  return (
    <div>
      {userID === null ? (
        <LoginScreen
          Register={(email, password) => Register(email, password)}
          Login={(email, password) => Login(email, password)}
        />
      ) : (
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="stretch"
          style={{ height: "100vh" }}
        >
          <div
            style={{
              backgroundColor: Colors.TopBar,
              height: 50,
              justifyContent: "center",
            }}
          >
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
              style={{ height: "100%", paddingRight: 10, paddingLeft: 10 }}
            >
              <div>
                <Grid
                  container
                  direction="row"
                  justify="flex-start"
                  alignItems="center"
                  style={{
                    fontFamily: "Roboto",
                    color: "white",
                  }}
                >
                  <img src={logo} style={{ width: 20 }} />
                  <div style={{ margin: 5 }}>PING PONG</div>
                </Grid>
              </div>

              <Button onClick={() => Logout()}>
                <ExitToAppIcon fontSize="large" style={{ color: "white" }} />
              </Button>
            </Grid>
          </div>
          {counter === null ? (
            <CounterSelection
              uid={userID}
              firestore={firestore}
              OpenCounter={(c) => setCounter(c)}
            />
          ) : (
            <Counter
              uid={userID}
              firestore={firestore}
              counter={counter}
              return={() => setCounter(null)}
            />
          )}
        </Grid>
      )}
    </div>
  );
}

export default App;
