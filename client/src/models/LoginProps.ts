export interface LoginPageProps {
  onLoginSuccess: () => void;  // Called on successful login
  setIsAuthenticated: (authenticated: boolean) => void;  // To set authentication state in App
}
