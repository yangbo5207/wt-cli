import React from 'react';
import { render } from 'react-dom';

const App = () => (
  <div>
    <h1>Hello, world</h1>
    <p>this is a react app.</p>
  </div>
)

render(<App />, document.body);