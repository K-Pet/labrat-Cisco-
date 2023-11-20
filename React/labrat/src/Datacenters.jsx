import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./datacenters.scss";
import api from './api';
import qs from 'qs';
import Sidebar from './Sidebar';
import Widget from './Widget';
import { Datatable } from './Datatable';



export const Datacenters = (props) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [labIds, setLabIds] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const dcColumns = [
        { field: 'name', headerName: 'Name', width: 130 },
        { field: 'description', headerName: 'Description'},
        { field: 'owner', headerName: 'Owner' },
        { field: 'address', headerName: 'Address'},
        { field: 'labs', headerName: 'Labs' },
      ];

    const handleNameChange = (e) => {
        setName(e.target.value);
    }
    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    }

    const handleAddressChange = (e) => {
        setAddress(e.target.value);
    };

    const handleLabIdsChange = (e) => {
        setLabIds(e.target.value.split(',').map(id => id.trim()));
    };
    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        const token_type = localStorage.getItem('token_type'); // Get the JWT token type from local storage
        const token = localStorage.getItem('access_token'); // Get the JWT token from local storage
        
        // Check if any of the required fields are empty
        if (name === '' || description === '' || address === '' || labIds.length === 0) {
            console.log('Please fill in all the required fields.');
            return;
        }

        const data = qs.stringify({  // Use qs to stringify the data
            name: name,
            description: description,
            address: address,
            labIds: labIds
        });

        const config = {
            method: 'post',
            url: '/datacenters/',
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
                props.navigate('/datacenters');
                setRefresh(!refresh);
            }
        }).catch((err) => {
            console.log('err: ', err);
            alert('There was an error in Item Creation');
        })
    };

    return (
        <div className="datacenters">
            <div className="title">
                <Sidebar />
            </div>
            <div className="dctable">
            <button onClick={toggleFormVisibility}>
                {isFormVisible ? 'Hide Form' : 'Add Datacenter'}
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
                            <label htmlFor="address">Address:</label>
                            <input type="text" id="address" value={address} onChange={handleAddressChange} />
                        </div>
                        <div className="formgroup">
                            <label htmlFor="labIds">Lab IDs (comma-separated):</label>
                            <input type="text" id="labIds" value={labIds.join(', ')} onChange={handleLabIdsChange} />
                        </div>
                        <button type="submit">Create Datacenter</button>
                    </form>
                </div>
            )}
                <div className='tablecontainer'>
                    <Datatable refresh={refresh} url='/datacenters/' columns={dcColumns}/>
                </div>
            </div>
        </div>
    );
}