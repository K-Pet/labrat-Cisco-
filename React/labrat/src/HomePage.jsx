import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./homepage.scss";
import api from './api';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Widget from './Widget';

export const HomePage = (props) => {

    return (
    <div className="home">
        <div className="title">
            <Sidebar />
        </div>
        <div className='homecontainer'>
            <div className='widgets'>
                <Widget type="datacenters" />
                <Widget type="labs" />
                <Widget type="racks"/>
                <Widget type="servers" />
                <Widget type="switches" />
                <Widget type="vms" />
            </div>
        </div>
    </div>
    )

}
// 