import React, { useState } from 'react';
import "./labs.scss";
import api from './api';
import Sidebar from './Sidebar';
import { Datatable } from './Datatable';
import qs from 'qs';


export const Labs = (props) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [rackIDs, setRackIDs] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const labColumns = [
        { field: 'name', headerName: 'Name', width: 130 },
        { field: 'description', headerName: 'Description'},
        { field: 'owner', headerName: 'Owner' },
        { field: '', headerName: '' },
        { field: 'racks', headerName: 'Racks' },
      ];

    const handleNameChange = (e) => {
        setName(e.target.value);
    }
    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    }

    const handleRacksChange = (e) => {
        setRackIDs(e.target.value.split(',').map(id => id.trim()));
    };
    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        const token_type = localStorage.getItem('token_type'); // Get the JWT token type from local storage
        const token = localStorage.getItem('access_token'); // Get the JWT token from local storage
        
        // Check if any of the required fields are empty
        if (name === '' || description === '' || rackIDs.length === 0) {
            console.log('Please fill in all the required fields.');
            return;
        }

        const data = qs.stringify({  // Use qs to stringify the data
            name: name,
            description: description,
            rackIDs: rackIDs
        });

        const config = {
            method: 'post',
            url: '/labs/',
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
        <div className="labs">
            <div className="title">
                <Sidebar />
            </div>
            <div className="labtable">
            <button onClick={toggleFormVisibility}>
                {isFormVisible ? 'Hide Form' : 'Add Lab'}
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
                            <label htmlFor="rackIDs"> Rack IDs (comma-separated):</label>
                            <input type="text" id="rackIDs" value={rackIDs.join(', ')} onChange={handleRacksChange} />
                        </div>
                        <button type="submit">Create Lab</button>
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