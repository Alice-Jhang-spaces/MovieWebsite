import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavigationBar = () => {
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
            setSearchInput('');
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
                <div className="container">
                    <Link className="navbar-brand" to="/home">
                        Movie Ticket
                    </Link>
                    <button 
                        className="navbar-toggler" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#navbarContent"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link active" to="/home">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/my-tickets">My Tickets</Link>
                            </li>
                        </ul>
                        <form className="d-flex me-3" onSubmit={handleSearch}>
                            <input 
                                className="form-control me-2" 
                                type="search" 
                                placeholder="Search movies..." 
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                            <button className="btn btn-outline-light" type="submit">
                                Search
                            </button>
                        </form>
                        <button 
                            onClick={handleLogout} 
                            className="btn btn-outline-danger"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <style jsx="true">{`
                body {
                    margin: 0;
                    padding: 0;
                }

                .navbar {
                    z-index: 1000; /* Ensure it stays on top */
                }

                .navbar + * {
                    margin-top: 60px; /* Avoid overlapping content */
                }

                .form-control {
                    min-width: 200px;
                }

                @media (max-width: 768px) {
                    .form-control {
                        min-width: auto;
                    }
                }
            `}</style>
        </>
    );
};

export default NavigationBar;
