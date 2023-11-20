import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./switches.scss";
import api from './api';
import Sidebar from './Sidebar';
import qs from 'qs';
import { Datatable } from './Datatable';

export const Switches = (props) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [numPorts, setNumPorts] = useState(0);
    const [portSpeed, setPortSpeed] = useState(0);
    const [model, setModel] = useState('');
    const [vendor, setVendor] = useState('');
    const [serialNumber, setSerialNumber] = useState('');
    const [managementIP, setManagementIP] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const labColumns = [
        { field: 'name', headerName: 'Name' },
        { field: 'description', headerName: 'Description'},
        { field: 'owner', headerName: 'Owner' },
        { field: '', headerName: '' },
        { field: 'numPorts', headerName: 'Number of Ports' },
        { field: 'portSpeed', headerName: 'Port Speed' },
        { field: 'model', headerName: 'Model' },
        { field: 'vendor', headerName: 'Vendor' },
        { field: 'serialNumber', headerName: 'Serial Number' },
        { field: 'managementIP', headerName: 'Management IP' },
    ];

    const handleNameChange = (e) => {
        setName(e.target.value);
    }
    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    }
    const handleNumPortsChange = (e) => {
        setNumPorts(parseInt(e.target.value));
    };
    const handlePortSpeedChange = (e) => {
        setPortSpeed(parseInt(e.target.value));
    };
    const handleModelChange = (e) => {
        setModel(e.target.value);
    };
    const handleVendorChange = (e) => {
        setVendor(e.target.value);
    };
    const handleSerialNumberChange = (e) => {
        setSerialNumber(e.target.value);
    };
    const handleManagementIPChange = (e) => {
        setManagementIP(e.target.value);
    };
    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        const token_type = localStorage.getItem('token_type'); // Get the JWT token type from local storage
        const token = localStorage.getItem('access_token'); // Get the JWT token from local storage
        
        // Check if any of the required fields are empty
        if (name === '' || description === '' || numPorts === 0 || portSpeed === 0 || model === '' || vendor === '' || serialNumber === '' || managementIP === '') {
            console.log('Please fill in all the required fields.');
            return;
        }

        const data = qs.stringify({  // Use qs to stringify the data
            name: name,
            description: description,
            
            numPorts: numPorts,
            portSpeed: portSpeed,
            model: model,
            vendor: vendor,
            serialNumber: serialNumber,
            managementIP: managementIP
        });

        const config = {
            method: 'post',
            url: '/servers/',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `${token_type} ${token}` // Add the JWT token to the request headers
            },
            data: data
        };

        // Call your API to create a new datacenter with the provided address and lab IDs
        api(config)  // Use the config object here
        .then((res) => {
            console.log('res: ', res);
            alert(res.data["message"])
            if(res.data["message"] === "Item Creation Failed"){
                alert("Item Creation Failed");
            } else{
                props.navigate('/labs');
                setRefresh(!refresh);
            }
        }).catch((err) => {
            console.log('err: ', err);
            alert('There was an error in Item Creation');
        })
    };

    return (
        <div className="switches">
            <div className="title">
                <Sidebar />
            </div>
            <div className="switchtable">
            <button onClick={toggleFormVisibility}>
                {isFormVisible ? 'Hide Form' : 'Add Switch'}
            </button>
            {isFormVisible && (
                <div className="formcontainer">
                    <form onSubmit={handleSubmit}>
                        <div className="formgroup">
                            <label htmlFor="name">Name:</label>
                            <input type="text" id="name" value={name} onChange={handleNameChange} />
                        </div>
                        <div className="formgroup">
                            <label htmlFor="description">Description:</label>
                            <input type="text" id="description" value={description} onChange={handleDescriptionChange} />
                        </div>

                        <div className="formgroup">
                            <label htmlFor="numPorts">Number of Ports:</label>
                            <input type="number" id="numPorts" value={numPorts} onChange={handleNumPortsChange} />
                        </div>
                        <div className="formgroup">
                            <label htmlFor="portSpeed">Port Speed:</label>
                            <input type="number" id="portSpeed" value={portSpeed} onChange={handlePortSpeedChange} />
                        </div>
                        <div className="formgroup">
                            <label htmlFor="model">Model:</label>
                            <input type="text" id="model" value={model} onChange={handleModelChange} />
                        </div>
                        <div className="formgroup">
                            <label htmlFor="vendor">Vendor:</label>
                            <input type="text" id="vendor" value={vendor} onChange={handleVendorChange} />
                        </div>
                        <div className="formgroup">
                            <label htmlFor="serialNumber">Serial Number:</label>
                            <input type="text" id="serialNumber" value={serialNumber} onChange={handleSerialNumberChange} />
                        </div>
                        <div className="formgroup">
                            <label htmlFor="managementIP">Management IP:</label>
                            <input type="text" id="managementIP" value={managementIP} onChange={handleManagementIPChange} />
                        </div>
                        <button type="submit">Create Switch</button>
                    </form>
                </div>
            )}
                <div className='tablecontainer'>
                    <Datatable refresh={refresh} url='/labs/' columns={labColumns}/>
                </div>
            </div>
        </div>
    );
}