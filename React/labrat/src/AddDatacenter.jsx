import React, { useState } from 'react';
import api from './api';
import Sidebar from './Sidebar';
import { Datatable } from './Datatable';




export const Datacenters = (props) => {
    const [address, setAddress] = useState('');
    const [labIds, setLabIds] = useState([]);

    const handleAddressChange = (e) => {
        setAddress(e.target.value);
    };

    const handleLabIdsChange = (e) => {
        setLabIds(e.target.value.split(',').map(id => id.trim()));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Call your API to create a new datacenter with the provided address and lab IDs
        api.createDatacenter({ address, labIds })
            .then(response => {
                // Handle the response
                console.log(response);
            })
            .catch(error => {
                // Handle the error
                console.error(error);
            });
    };

    return (
        <div className="datacenters">
            <div className="title">
                <Sidebar />
            </div>
            <div className='tablecontainer'>
                <div className="formcontainer">
                    <form onSubmit={handleSubmit}>
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
                <Datatable />
            </div>
        </div>
    );
};
