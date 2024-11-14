// src/App.js
import React from 'react';
import './App.css';
import MapView from './components/MapView';

function App() {
    return (
        <div className="App">
            <h1>Real-Time Railway GPS Tracker</h1>
            <br></br>
            <h2>Centralised cloud based detection</h2>
            <MapView />
        </div>
    );
}

export default App;
