import React from 'react';
import logo from './logo.svg';
import './App.scss';
import DateSlider from './components/date-slider/date-slider';
import SunClock from './components/sun-clock/sun-clock';
import TimePicker from './components/time-picker/time-picker';

function App() {
  return (
    <div className="app">
      <DateSlider></DateSlider>
      <SunClock></SunClock>
      <TimePicker></TimePicker>
    </div>
  );
}

export default App;
