import React from "react";
import { createBrowserHistory } from "history";
import { Switch, Redirect, Route } from "react-router-dom";
import Dashboard from "../views/Dashboard";
import { LOGIN__STATES } from "../views/Login/Login";
import Analytics from "../views/Analytics";
export const history = createBrowserHistory();

const AuthorizedRoute = React.memo(props => {
  const { session, component, path, ...restProps } = props;
  const sessionState = session?.state;
  if (sessionState === LOGIN__STATES.SUCCESS) {
    return <Route path={path} component={component} {...restProps} />;
  } else {
    return (
      <Redirect
        to={{
          pathname: "/login",
          state: { referrer: path }
        }}
      ></Redirect>
    );
  }
});

export default props => {
  return (
    <Switch>
      <AuthorizedRoute
        path="/"
        exact
        session={props.session}
        component={Dashboard}
      />
      <Route
        session={props.session}
        exact
        path="/analytics"
        component={Analytics}
      />
    </Switch>
  );
};
