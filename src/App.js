import React from 'react';
import zs from './zs.png';

class App extends React.Component {
  render() {

    const style = {
      width: '200px',
      display: 'block'
    }

    return (
      <div className="app-wrap">
        <h1>hello, world!</h1>
        <p>this is a react modul named App ssdfs.</p>
        <img src={zs} style={style} alt=""/>
      </div>
    )
  }
}

export default App;