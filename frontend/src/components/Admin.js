import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavigationBar from './home/NavigationBar';  

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token');
            
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/users/all-users`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setUsers(response.data.users || []);
            } catch (err) {
                setUsers([]); 
                setError('Failed to fetch users');
                if (err.response?.status === 401) {
                    navigate('/login');
                }
            }
        };

        fetchUsers();
    }, [navigate]);

    return (
        <>
            <NavigationBar />
            <div className="container mt-5">
                <div className="row">
                    <div className="col">
                        <h2 className="mb-4">User Management</h2>
                        
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}

                        <div className="card">
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>Email</th>
                                                <th></th>
                                                <th>User Type</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(users) && users.length > 0 ? (
                                                users.map((user, index) => (
                                                    <tr key={index}>
                                                        <td>{user.email}</td>
                                                        <td>{user.username}</td>
                                                        <td>
                                                        <span className={`badge ${user.email === 'admin@example.com' ? 'bg-danger' : 'bg-primary'}`}>
                                                        {user.email === 'admin@example.com' ? 'Admin' : 'User'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className="badge bg-success">
                                                                Active
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center">
                                                        No users found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx="true">{`
                     .table {
                    margin-bottom: 0;
                }
                .badge {
                    font-size: 0.875em;
                }
                .card {
                    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
                }
                .table-dark {
                    background-color: #212529;
                }
                body {
                    background-color: #1a1a1a;
                }
            `}</style>
            
        </>
    );
};

export default Admin;