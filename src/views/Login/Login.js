import React, { Component } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import styles from "./Login.module.scss";
import { isEmpty } from "lodash";
import AvatarImage from "../../_images/webb-dark.png";
import { useRouteMatch, useHistory, Redirect } from "react-router-dom";

const USERNAME = "test";
const PASSWORD = "test";

export const LOGIN__STATES = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED"
};

const defaultFormValues = { username: "", password: "" };
const defaultHelpText = { username: "", password: "" };

class LoginForm extends Component {
  static defaultProps = {
    onSubmit: () => {},
    onStateChange: () => {}
  };

  state = {
    values: { ...defaultFormValues },
    helpText: { ...defaultHelpText },
    touched: {},
    validationError: {},
    validationErrorTexts: {}
  };

  setInternalState = (state, callback = () => {}) => {
    this.setState(state, () => {
      this.props.onStateChange(this.state);
      callback();
    });
  };

  validateForm = (callback = () => {}) => {
    const { username, password } = this.state.values;
    const validationError = {};
    const validationErrorTexts = {};

    if (!username) {
      validationError["username"] = true;
      validationErrorTexts["username"] = "Username is a required field";
    }
    if (!password) {
      validationError["password"] = true;
      validationErrorTexts["password"] = "Password is a required field";
    }
    this.setInternalState(
      {
        validationError,
        validationErrorTexts
      },
      callback
    );
  };

  handleBlur = event => {
    const { target } = event;
    this.setInternalState(
      {
        touched: {
          ...this.state.touched,
          [target.name]: true
        }
      },
      this.validateForm
    );
  };

  handleInputChange = event => {
    const { target } = event;
    this.setInternalState(
      {
        values: {
          ...this.state.values,
          [target.name]: target.value
        }
      },
      () => this.handleBlur({ target })
    );
  };

  handleFormSubmit = event => {
    event.stopPropagation();
    event.preventDefault();
    const { values } = this.state;
    const touched = Object.keys(values).reduce((tillNow, key) => {
      tillNow[key] = true;
      return tillNow;
    }, {});
    this.setInternalState(
      {
        touched
      },
      this.validateForm(() => {
        const { values, validationError } = this.state;
        if (isEmpty(validationError)) {
          this.props.onSubmit(values);
        }
      })
    );
  };

  render() {
    const inProgress = this.props.status === LOGIN__STATES.IN_PROGRESS;
    return (
      <div className={classNames(styles["login-form__wrapper"])}>
        <img
          className={classNames(styles["avatar__image"])}
          alt="Avatar"
          src={AvatarImage}
          width="200px"
          height="200px"
        ></img>
        <form
          onSubmit={this.handleFormSubmit}
          className={classNames(styles["login-form"])}
        >
          <div
            className={classNames(styles["form-input__wrapper"])}
            data-error={
              this.state.touched.username &&
              !!this.state.validationError.username
            }
          >
            <label htmlFor="form_item__username">Username</label>
            <input
              onChange={this.handleInputChange}
              onBlur={this.handleBlur}
              type="text"
              id="form_item__username"
              name="username"
              value={this.state.values.username}
            ></input>
            {this.state.touched.username ? (
              <span>
                {this.state.validationError.username
                  ? this.state.validationErrorTexts.username
                  : this.state.helpText.username}
              </span>
            ) : null}
          </div>
          <div
            className={classNames(styles["form-input__wrapper"])}
            data-error={
              this.state.touched.password &&
              !!this.state.validationError.password
            }
          >
            <label htmlFor="form_item__password">Password</label>
            <input
              onChange={this.handleInputChange}
              onBlur={this.handleBlur}
              type="password"
              id="form_item__password"
              name="password"
              value={this.state.values.password}
            ></input>
            {this.state.touched.password ? (
              <span>
                {this.state.validationError.password
                  ? this.state.validationErrorTexts.password
                  : this.state.helpText.password}
              </span>
            ) : null}
          </div>
          <button disabled={inProgress} type="submit">
            {inProgress ? "Submitting..." : "Submit"}
          </button>
          {this.props.status === LOGIN__STATES.FAILED ? (
            <div>
              <span>Entered credentials are invalid</span>
            </div>
          ) : null}
        </form>
      </div>
    );
  }
}

export default props => {
  const { path, session, setSession } = props;
  const sessionState = session?.state;
  const visible = useRouteMatch(path)?.isExact;
  const history = useHistory();
  let goTo = "/";
  if (history.location.state?.referrer) {
    goTo = decodeURI(history.location.state.referrer);
  }
  return ReactDOM.createPortal(
    <div
      className={classNames(styles["login-wrapper"], {
        [styles["visible"]]: visible
      })}
    >
      {visible ? (
        <>
          {sessionState === LOGIN__STATES.SUCCESS ? (
            <Redirect to={goTo} />
          ) : (
            <>
              <div className={classNames(styles["background"])}></div>
              <LoginForm
                status={sessionState}
                onSubmit={({ username, password }) => {
                  setSession({ state: LOGIN__STATES.IN_PROGRESS });
                  setTimeout(() => {
                    if (username === USERNAME && password === PASSWORD) {
                      setSession({ state: LOGIN__STATES.SUCCESS });
                    } else {
                      setSession({ state: LOGIN__STATES.FAILED });
                    }
                  }, 2000);
                }}
              />
            </>
          )}
        </>
      ) : null}
    </div>,
    document.querySelector("body")
  );
};
