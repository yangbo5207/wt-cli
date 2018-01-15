import React from 'react';
import { render } from 'react-dom';
import './style.css';

const App = () => (
  <div>
    <h1>Hello, world</h1>
    <p>this is a react app.</p>
  </div>
)

var wrap = document.querySelector('#wrap');

render(<App />, wrap);