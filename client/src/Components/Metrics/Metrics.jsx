import React from "react";

import IntensityGraph from "../IntensityGraph/IntensityGraph";
import LikelihoodGraph from "../LikelihoodGraph/LikelihoodGraph";
import RelavanceGraph from "../RelevanceGraph/RelevanceGraph";
import TopicsGraph from "../TopicsGraph/TopicsGraph";
import RegionGraph from "../RegionGraph/RegionGraph";

import "./metrics.scss";

function Metrics() {
     return (
        <div className="metrics">
            <h1>Article Data</h1>
            <div className="myflex">
                <RegionGraph/>
            </div>
            <div className="myflex">
                <TopicsGraph/>
                <IntensityGraph/>
            </div>
            <div className="myflex">
                <LikelihoodGraph/>
                <RelavanceGraph/>
            </div>
        </div>
    );
}

export default Metrics;