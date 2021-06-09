import React from 'react';
import "./index.css";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import BookingForm from "./BookingForm";
import Seats from "./Seats";
import Success from './Success';


function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <BookingForm />
        </Route>
        <Route path="/select" exact>
          <Seats />
        </Route>
        <Route path="/success" exact>
          <Success />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
