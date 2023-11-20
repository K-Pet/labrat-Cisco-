import React, { useState } from 'react';
import qs from 'qs';  
import api from './api';


export const Login = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault(); // prevents page from refreshing
        if (!username || !password) {
            alert('Please enter a username and password');
            return;
        }
        const data = qs.stringify({  // Use qs to stringify the data
            username: username,
            password: password
        });
    
        const config = {
            method: 'post',
            url: '/auth/login',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };

        api(config)  // Use the config object here
        .then((res) => {
            console.log('res: ', res);
            alert(res.data["message"])
            if(res.data["message"] === "Login Failed"){
                alert("Login Failed");
            } else{
                localStorage.setItem('access_token', res.data['access_token']);
                localStorage.setItem('token_type', res.data['token_type']);
                props.navigate('/home');
            }
        }).catch((err) => {
            console.log('err: ', err);
            alert('There was an error logging in');
        })
    }


  return (
      <div className="auth-form-container">
        <h1>Log In</h1>
        <form className= "login-form" onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)}type="text" placeholder= "Username" id="username" name="username" />
            <label htmlFor="password">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)}type="password" placeholder= "********" id="password" name="password" />
            <button type="submit"> Log In</button>
        </form>
        <button className="link-btn" onClick={() => props.onFormSwitch('register')}>Register</button>
      </div>
    )
}