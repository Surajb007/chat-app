import React, { Component } from "react";
import { Link } from "react-router-dom";
import Styles from "./Styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const firebase = require("firebase");

class Signup extends Component {
  state = {
    email: "",
    password: "",
    passwordConfirmation: "",
    signUpError: ""
  };
  submitSignup = e => {
    e.preventDefault();
    if (!this.formIsValid()) {
      this.setState({ signUpError: "Passwords don't match!!" });
      return;
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(
        authRes => {
          const userObj = {
            email: authRes.user.email
          };
          firebase
            .firestore()
            .collection("users")
            .doc(this.state.email)
            .set(userObj)
            .then(
              () => {
                this.props.history.push("/dashboard");
              },
              dbErr => {
                console.log(dbErr);
                this.setState({ signUpError: "Failed to add User" });
              }
            );
        },
        authError => {
          console.log(authError);
          this.setState({ signUpError: "Failed to add User" });
        }
      );
  };
  formIsValid = () => {
    return this.state.password === this.state.passwordConfirmation;
  };
  userTyping = (type, e) => {
    switch (type) {
      case "email":
        this.setState({ email: e.target.value });
        break;
      case "password":
        this.setState({ password: e.target.value });
        break;
      case "passwordConfirmation":
        this.setState({ passwordConfirmation: e.target.value });
        break;
      default:
        break;
    }
  };
  render() {
    const { classes } = this.props;
    return (
      <main className={classes.main}>
        <CssBaseline>
          <Paper className={classes.paper}>
            <Typography component="h1" variant="h5">
              Sign Up!
            </Typography>
            <form onSubmit={e => this.submitSignup(e)} className={classes.form}>
              <FormControl required fullWidth margin="normal">
                <InputLabel htmlFor="signup-email-input">
                  Enter Your Email
                </InputLabel>
                <Input
                  autoComplete="email"
                  autoFocus
                  onChange={e => this.userTyping("email", e)}
                  id="signup-email-input"
                />
              </FormControl>
              <FormControl required fullWidth margin="normal">
                <InputLabel htmlFor="signup-password-input">
                  Create A Password
                </InputLabel>
                <Input
                  type="password"
                  onChange={e => this.userTyping("password", e)}
                  id="signup-password-input"
                />
              </FormControl>
              <FormControl required fullWidth margin="normal">
                <InputLabel htmlFor="signup-password-confirmation-input">
                  Confirm Your Password
                </InputLabel>
                <Input
                  type="password"
                  onChange={e => this.userTyping("passwordConfirmation", e)}
                  id="signup-password-confirmation-input"
                />
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Submit
              </Button>
            </form>
            {this.state.signUpError ? (
              <Typography
                className={classes.errorText}
                component="h5"
                variant="h6"
              >
                {this.state.signUpError}
              </Typography>
            ) : null}
            <Typography
              component="h5"
              variant="h6"
              className={classes.hasAccountHeader}
            >
              Already Have an Account
            </Typography>
            <Link to="/login" className={classes.logInLink}>
              Login!
            </Link>
          </Paper>
        </CssBaseline>
      </main>
    );
  }
}
export default withStyles(Styles)(Signup);
