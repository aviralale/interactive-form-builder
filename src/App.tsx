import FormBuilder from "./components/FormBuilder";
import { ThemeProvider } from "./components/themes/theme-provider";

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <FormBuilder />
    </ThemeProvider>
  );
};

export default App;
