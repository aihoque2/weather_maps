import logo from './logo.svg';
import './App.css';
import ButtonMenu from './components/ButtonMenu';
import ColorMap from './components/ColorMap';
import TestHumidity from './components/TestComponent';


import {useState} from 'react'

function App() {

  // Starter, temperature, wind_speed, humidity,
  const [mode, setMode] = useState("start")

  const mapHandler = (event) => {
    console.log(event.target.dataset.name);
  };


  let graphic; 

  console.log("mode: ", mode);
  if (mode === "start"){
    graphic = <img src={logo} className="App-logo" alt="logo" />;
  }else if (mode === "test"){
    graphic = <TestHumidity></TestHumidity>
  } 
  else{
    graphic = <ColorMap mode={mode} onClick={mapHandler}/>;

  }

  return (
    <div className="App">
      <h1>
        <ButtonMenu setMode={setMode} mode={mode}></ButtonMenu>
      </h1>
        <p>
          Put some map of some weather data here or something idk
        </p>

        <div>
          {graphic}
        </div>

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
