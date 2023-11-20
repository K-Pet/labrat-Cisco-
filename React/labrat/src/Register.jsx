import React, { useState } from "react";
import api from './api';


export const Register = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault(); // prevents page from refreshing
        if (!username || !password) {
            alert('Please enter a username and password');
            return;
        }
        api.post('/auth/newuser', {
            username: username,
            password: password
        }).then((res) => {
            console.log('res: ', res);
            alert(res.data["message"])
            if(res.data["message"] === "Login Failed"){
                alert("Login Failed");
            } else{
                localStorage.setItem('token', res.data['token']);
                localStorage.setItem('username', res.data['username']);
                props.onFormSwitch('login'); // Switch to login view
            }
        }).catch((err) => {
            console.log('err: ', err);
            alert('There was an error logging in');
        })
    }

    return (
        <div className="auth-form-container">
            <h1>Register</h1>
            <form className="register-form" onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)}type="text" placeholder= "Username" id="username" name="username" />
                <label htmlFor="password">Password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)}type="password" placeholder= "********" id="password" name="password" />
                <button type="submit"> Register</button>
            </form>
            <button className="link-btn" onClick={() => props.onFormSwitch('login')}>Log In</button>
        </div>
    );
}