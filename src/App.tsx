import { BrowserRouter as Router } from "react-router-dom";
import { ConditionalProviders } from "./providers/ConditionalProviders";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  return (
    <Router>
      <ConditionalProviders>
        <AppRoutes />
      </ConditionalProviders>
    </Router>
  );
}

export default App;