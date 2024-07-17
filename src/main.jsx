import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {Provider} from 'react-redux'
import store from './Redux/store.jsx'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
ReactDOM.createRoot(document.getElementById("root")).render(

  <Provider store={store}>

      <App />
  </Provider>

);
