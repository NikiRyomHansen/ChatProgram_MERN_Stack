import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import LoginContainer from './components/LoginContainer'
import LoginBox from "./components/Login";
import RegisterBox from "./components/RegisterBox";
import "./sass/loginSty.scss"

ReactDOM.render(
  <>
    <LoginContainer />
    <LoginBox />
    <RegisterBox />
  </>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
