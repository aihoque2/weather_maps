import logo from './logo.svg';
import './App.css';
import ButtonMenu from './components/ButtonMenu';

import {useState} from 'react'

function App() {

  // Starter, temperature, wind_speed, humidity,
  const [mode, setMode] = useState("starter")

  return (
    <div className="App">
      <h1>
        <ButtonMenu></ButtonMenu>
      </h1>
        <p>
          Put some map of some weather data here or something idk
        </p>
        {
        <img src={logo} className="App-logo" alt="logo" />
        }
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
