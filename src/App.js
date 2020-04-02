import React, { Component } from "react";
import Login, { LOGIN__STATES } from "./views/Login/Login";
import Routes, { history } from "./routes";
import { Router, Link } from "react-router-dom";
import styles from "./App.module.scss";

class App extends Component {
  state = { visible: true, session: { state: LOGIN__STATES.PENDING } };
  setSession = session => {
    this.setState({ session });
  };
  render() {
    return (
      <div className={styles.app}>
        <Router history={history}>
          <nav className={styles["site-nav"]}>
            <ul>
              <li>
                <Link to="/">React Auth</Link>
              </li>
              <li>
                <Link to="/analytics">Analytics</Link>
              </li>
              <li>
                {this.state.session.state === LOGIN__STATES.SUCCESS ? (
                  <a
                    href="#logout"
                    onClick={() => {
                      this.setSession({
                        session: {
                          state: LOGIN__STATES.PENDING
                        }
                      });
                    }}
                  >
                    Logout
                  </a>
                ) : (
                  <Link to="/login">Login</Link>
                )}
              </li>
            </ul>
          </nav>
          <Login
            session={this.state.session}
            setSession={this.setSession}
            path="/login"
          />
          <Routes session={this.state.session} />
        </Router>
      </div>
    );
  }
}

export default App;
