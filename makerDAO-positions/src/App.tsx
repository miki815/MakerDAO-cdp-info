import Homepage from "./components/Homepage";
import SingleCDP from "./components/SingleCDP";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider
  }
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Homepage} />
        <Route path="/cdp/:id/:collT/:coll/:debt/:owner" Component={SingleCDP} />
      </Routes>
    </Router>
  );
}

export default App;
