import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Login } from './Login';
import { Register } from './Register';
import { HomePage } from './HomePage';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Datacenters } from './Datacenters';
import { Labs } from './Labs';
import { Racks } from './Racks';
import { Servers } from './Servers';
import { Switches } from './Switches';
import { VMs } from './VMs';

function Auth() {
  const navigate = useNavigate();
  const [currentForm, setCurrentForm] = useState("login"); // ['login', 'register']

  const handleFormChange = (formName) => {
    setCurrentForm(formName);
  }
  
  return (
    <div className="App">
    {
      currentForm === "login" ? <Login onFormSwitch={handleFormChange} navigate={navigate}/> : <Register onFormSwitch={handleFormChange} navigate={navigate}/>
    }
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/">
        <Route index element={<Auth />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/datacenters" element={<Datacenters />} />
        <Route path="/labs" element={<Labs />} />
        <Route path="/racks" element={<Racks />} />
        <Route path="/servers" element={<Servers />} />
        <Route path="/switches" element={<Switches />} />
        <Route path="/vms" element={<VMs />} />
      </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;