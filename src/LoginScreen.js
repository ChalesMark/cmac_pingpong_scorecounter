import React, { useState, useEffect } from "react";
import { Grid, TextField, Button, Box } from "@material-ui/core";
import { Colors, Styles } from "./GlobalStyles";
const logo = require("./Images/LogoColor.png");
const LoginScreen = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLogginIn] = useState(true);

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      style={Styles.Centered}
    >
      <img src={logo} style={{ width: 200 }} />
      <div
        style={{
          margin: 5,
          fontFamily: "Acme",
          color: Colors.TopBar,
          fontSize: 50,
        }}
      >
        PING PONG
      </div>
      {loggingIn ? (
        // LOG IN -------------------------------------------------------------------------------
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          style={{ width: "100%" }}
        >
          <TextField
            label="email"
            variant="outlined"
            value={email}
            style={Styles.LoginFields}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="password"
            variant="outlined"
            value={password}
            type="password"
            style={Styles.LoginFields}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            style={Styles.FullButton}
            onClick={() => props.Login(email, password)}
          >
            Login
          </Button>
          <Button
            variant="contained"
            style={Styles.FullButton}
            onClick={() => setLogginIn(false)}
          >
            Switch to Register
          </Button>
        </Grid>
      ) : (
        // REGISTER -------------------------------------------------------------------------------
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          style={{ width: "100%" }}
        >
          <TextField
            label="email"
            variant="outlined"
            value={email}
            style={Styles.LoginFields}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="password"
            variant="outlined"
            value={password}
            type="password"
            style={Styles.LoginFields}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            style={Styles.FullButton}
            onClick={() => props.Register(email, password)}
          >
            REGISTER
          </Button>
          <Button
            variant="contained"
            style={Styles.FullButton}
            onClick={() => setLogginIn(true)}
          >
            Switch to Login
          </Button>
        </Grid>
      )}
    </Grid>
  );
};
export default LoginScreen;
