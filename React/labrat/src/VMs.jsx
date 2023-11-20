import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./vms.scss";
import api from './api';
import Sidebar from './Sidebar';
import { Datatable } from './Datatable';
import qs from 'qs';

export const VMs = (props) => {
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
        { field: 'name', headerName: 'Name', width: 130 },
        { field: 'description', headerName: 'Description'},
        { field: 'owner', headerName: 'Owner' },
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
        async function createVM() {
            const currentTime = new Date().toISOString(); // Get current time as string

            const vmData = {
                name: name,
                description: description,
                serialnumber: serialNumber, // Updated field name
                boardip: boardIP, // Updated field name
                model: model,
                os: os,
                cores: cores,
                memory: memory,
                storage: storage,
                creation_time: currentTime, // Set creation_time to current time
                last_modified_time: currentTime // Set last_modified_time to current time
            };

            const token = localStorage.getItem('access_token');

            try {
                const response = await api.post('/vms/', vmData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                console.log(response.data);
            } catch (error) {
                console.error('Error creating VM:', error.response.data);
            }
        }
        createVM();
        setRefresh(!refresh);
    }

    return (
        <div className="vms">
            <div className="title">
                <Sidebar />
            </div>
            <div className="vmtable">
            <button onClick={toggleFormVisibility}>
                {isFormVisible ? 'Hide Form' : 'Add VM'}
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
                        <button type="submit">Create VM</button>
                    </form>
                </div>
            )}
                <div className='tablecontainer'>
                    <Datatable refresh={refresh} url='/vms/' columns={labColumns}/>
                </div>
            </div>
        </div>
    );
}