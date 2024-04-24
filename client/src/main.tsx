import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(

  // React.StrictMode is removed from the following code block :

  // <React.StrictMode> 
  //   <App />
  // </React.StrictMode>,
  
  // React.StrictMode is intentionally removed for the production build of the application.
  // During development, React.StrictMode invokes certain lifecycle methods and state updates twice,
  // in order to help identify potential problems in the app.
  
  // This is useful for catching issues early, but it also can lead to confusing behavior during development,
  // such as double API calls which do not occur in production. In this case, it is safe to remove React.StrictMode

  // Reference: https://legacy.reactjs.org/docs/strict-mode.html
  
  <App />,
);
