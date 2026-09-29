import React from "react";
import { Redirect } from "expo-router";
import { getSession } from "../src/auth/authStore";

export default function Index() {
  const [ready, setReady] = React.useState(false);
  const [authenticated, setAuthenticated] = React.useState(false);

  React.useEffect(() => {
    getSession().then((session) => {
      setAuthenticated(Boolean(session));
      setReady(true);
    });
  }, []);

  if (!ready) return null;
  return <Redirect href={authenticated ? "/(app)/messages" : "/(auth)/login"} />;
}
