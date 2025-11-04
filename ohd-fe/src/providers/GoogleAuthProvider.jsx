import { GoogleOAuthProvider } from "@react-oauth/google";

export default function GoogleAuthProviderWrapper({ children }) {
  return (
    <GoogleOAuthProvider clientId="864191630643-po46vlvodgqfaattkn97o9jgf139n8ka.apps.googleusercontent.com">
      {children}
    </GoogleOAuthProvider>
  );
}
