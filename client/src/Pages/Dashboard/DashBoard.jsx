import React from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Metrics from "../../Components/Metrics/Metrics";
import './dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard">
      <Sidebar/>
      <Metrics/>
    </div>
  );
}

export default Dashboard;