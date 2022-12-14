'use strict';

import Logo from './components/Logo';
import React from 'react';
import ReactDOM from 'react-dom';
import Button from './components/Button'

ReactDOM.render(
  <div style={{padding: '20px'}}>
    <h1>Componente discovery </h1>
    <h2>Logo</h2>
    <div style={{display: 'inline-block', background: 'purple'}}>
      <Logo/> 
    </div>
    <h2>Buttons</h2>
    <div>
      Button with onClick: <Button onClick={() => alert('ouch')}>Click me</Button>
    </div>
    <div>
      A Link: <Button href="http://reactjs.com">Follow me</Button>
    </div>
    <div>
      Custom class name: <Button className="custom">I do nothing</Button>
    </div>
  </div>
  ,
  document.getElementById('pad')
);