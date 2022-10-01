import logo from "./logo.svg";
import "./App.css";
import Coins from "./components/coins";

function App() {
    return (
        <div className="App">
            <h1 className="text-xl my-5 font-bold">Crypto Currencies</h1>
            <Coins />
        </div>
    );
}

export default App;
