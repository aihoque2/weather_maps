import logo from './logo.svg';
import './App.css';
import ButtonMenu from './components/ButtonMenu';

function App() {
  return (
    <div className="App">
        <ButtonMenu></ButtonMenu>
        <p>
          Put some map of some weather data here or something idk
        </p>
        <img src={logo} className="App-logo" alt="logo" />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Git Gud
        </a>
    </div>
  );
}

export default App;
