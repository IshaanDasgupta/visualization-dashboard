import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Form , Button} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

import './sidebar.scss';

function Sidebar() {
    const [topic , setTopic] = useState("");
    const [country , setCountry] = useState("");
    const [sector , setSector] = useState("");
    const [source , setSource] = useState("");

    const [open,setOpen] = useState(false);


    const handleTopicChange = (e) => {
        setTopic(e.target.value);
    }

    const handleCountryChange = (e) => {
        setCountry(e.target.value);
    }

    const handleSectorChange = (e) => {
        setSector(e.target.value);
    }

    const handleSourceChange = (e) => {
        setSource(e.target.value);
    }

    const navigate = useNavigate();

    const handleClick = () => {
        let query = "/?";
        if (topic.length){
            query += `topic=${topic}&`;
        }
        if (country.length){
            query += `country=${country}&`;
        }
        if (sector.length){
            query += `sector=${sector}&`;
        }
        if (source.length){
            query += `source=${source}&`;
        }
        console.log(query);
        navigate(query);
    }

  return (
    <>
        <div className="navButton">
            <FontAwesomeIcon className="icon" icon={faBars} onClick={()=>{setOpen(!open)}} size="2x"/>
        </div>

        <div className={open ? "openSidebar" : "sidebar"}>
            <div className= "upper__container">
                <div className="links">
                <ul>
                    <li>
                    <a href="/" className="display-6">Overview</a>
                    </li>
                </ul>
                </div>
                <Form>
                    <Form.Group className="mb-3">
                        <h1 className="display-6">Filter :</h1>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Topic :</Form.Label>
                        <Form.Control type="text" placeholder="Enter topic" onChange={handleTopicChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Country :</Form.Label>
                        <Form.Control type="text" placeholder="Enter country" onChange={handleCountryChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Sector :</Form.Label>
                        <Form.Control type="text" placeholder="Enter sector" onChange={handleSectorChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Source :</Form.Label>
                        <Form.Control type="text" placeholder="Enter source" onChange={handleSourceChange} />
                    </Form.Group>
                </Form>
                <Button variant="light" type="submit" onClick={handleClick}>
                    Filter
                </Button>
            </div>
        </div>
    </>
  );
}

export default Sidebar;