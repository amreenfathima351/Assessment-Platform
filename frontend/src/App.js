import "./App.css";
import Router from "./Router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css"
function App() {
  return (
    <>
      <Router />
      <ToastContainer />
    </>
  );
}

export default App;
