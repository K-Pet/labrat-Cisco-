import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./servers.scss";
import api from './api';
import Sidebar from './Sidebar';
import qs from 'qs';
import { Datatable } from './Datatable';

export const Servers = (props) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [serialNumber, setSerialNumber] = useState('');
    const [boardIP, setBoardIP] = useState('');
    const [model, setModel] = useState('');
    const [os, setOS] = useState('');
    const [cores, setCores] = useState('');
    const [memory, setMemory] = useState('');
    const [storage, setStorage] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const labColumns = [
        { field: 'name', headerName: 'Name' },
        { field: 'description', headerName: 'Description'},
        { field: 'owner', headerName: 'Owner' },
        { field: '', headerName: '' },
        { field: 'serialNumber', headerName: 'Serial Number' },
        { field: 'boardIP', headerName: 'Board IP' },
        { field: 'model', headerName: 'Model' },
        { field: 'os', headerName: 'OS' },
        { field: 'cores', headerName: 'Cores' },
        { field: 'memory', headerName: 'Memory' },
        { field: 'storage', headerName: 'Storage' },
    ];

    const handleNameChange = (e) => {
        setName(e.target.value);
    }
    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    }
    const handleSerialNumberChange = (e) => {
        setSerialNumber(e.target.value);
    };
    const handleBoardIPChange = (e) => {
        setBoardIP(e.target.value);
    };
    const handleModelChange = (e) => {
        setModel(e.target.value);
    };
    const handleOSChange = (e) => {
        setOS(e.target.value);
    };
    const handleCoresChange = (e) => {
        setCores(e.target.value);
    };
    const handleMemoryChange = (e) => {
        setMemory(e.target.value);
    };
    const handleStorageChange = (e) => {
        setStorage(e.target.value);
    };
    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        const token_type = localStorage.getItem('token_type'); // Get the JWT token type from local storage
        const token = localStorage.getItem('access_token'); // Get the JWT token from local storage
        
        // Check if any of the required fields are empty
        if (name === '' || description === '' || serialNumber === '' || boardIP === '' || model === '' || os === '' || cores === '' || memory === '' || storage === '') {
            console.log('Please fill in all the required fields.');
            return;
        }

        const data = qs.stringify({  // Use qs to stringify the data
            name: name,
            description: description,
            serialNumber: serialNumber,
            boardIP: boardIP,
            model: model,
            os: os,
            cores: cores,
            memory: memory,
            storage: storage
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
        <div className="servers">
            <div className="title">
                <Sidebar />
            </div>
            <div className="servertable">
            <button onClick={toggleFormVisibility}>
                {isFormVisible ? 'Hide Form' : 'Add Server'}
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
                            <label htmlFor="serialNumber">Serial Number:</label>
                            <input type="text" id="serialNumber" value={serialNumber} onChange={handleSerialNumberChange} />
                        </div>
                        <div className="formgroup">
                            <label htmlFor="boardIP">Board IP:</label>
                            <input type="text" id="boardIP" value={boardIP} onChange={handleBoardIPChange} />
                        </div>
                        <div className="formgroup">
                            <label htmlFor="model">Model:</label>
                            <input type="text" id="model" value={model} onChange={handleModelChange} />
                        </div>
                        <div className="formgroup">
                            <label htmlFor="os">OS:</label>
                            <input type="text" id="os" value={os} onChange={handleOSChange} />
                        </div>
                        <div className="formgroup">
                            <label htmlFor="cores">Cores:</label>
                            <input type="text" id="cores" value={cores} onChange={handleCoresChange} />
                        </div>
                        <div className="formgroup">
                            <label htmlFor="memory">Memory:</label>
                            <input type="text" id="memory" value={memory} onChange={handleMemoryChange} />
                        </div>
                        <div className="formgroup">
                            <label htmlFor="storage">Storage:</label>
                            <input type="text" id="storage" value={storage} onChange={handleStorageChange} />
                        </div>
                        <button type="submit">Create Server</button>
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