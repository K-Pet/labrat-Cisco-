import React, { useState, useEffect } from 'react';
import qs from 'qs';  
import "./datatable.scss"
import { DataGrid } from '@mui/x-data-grid';
import api from './api'; // Import your API module


export const Datatable = (props) => {

    const [tabledata, setTabledata] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const token_type = localStorage.getItem('token_type'); // Get the JWT token type from local storage
            const token = localStorage.getItem('access_token'); // Get the JWT token from local storage

            const config = {
                method: 'get',
                url: props.url, // Use the URL from props
                headers: {
                    'Content-Type': 'application/josn',
                    'Authorization': `${token_type} ${token}` // Add the JWT token to the request headers
                }
            };

            try {
                const response = await api(config); // Use the config object here
                console.log('response: ', response);
                setTabledata(response.data);
            } catch (error) {
                console.log('error: ', error);
                alert('There was an error fetching data');
            }
        };

        fetchData();
    }, [props.refresh]);

    return (
        <div className="datatable">
            <DataGrid
                rows={tabledata} // Use the fetched data for rows
                columns={props.columns}
                getRowId={(row) => row.serialnumber}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10, 20, 50]}
                checkboxSelection
            />
        </div>
    )
}