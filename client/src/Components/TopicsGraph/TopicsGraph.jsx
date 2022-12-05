import React, { useCallback, useEffect, useState } from 'react'
import * as d3 from 'd3'
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useRef } from 'react';
import './topicGraph.scss';

const TopicsGraph =  () => {

    const params = new URLSearchParams(useLocation().search);
    let queryStr = "?";
    if (params.get("topic")){
        queryStr += `topic=${params.get('topic')}&`
    }
    if (params.get("country")){
        queryStr += `country=${params.get('country')}&`
    }
    if (params.get("sector")){
        queryStr += `sector=${params.get('sector')}&`
    }
    if (params.get("source")){
        queryStr += `source=${params.get('source')}&`
    }

    const topicRef = useRef(null);

    const [width, setWidth] = useState(null);

    const fetchData = async() => {
        const height = width/2;

        const innerRadius = 0;
        const outerRadius = width/4;

        const res = await axios.get(`/api${queryStr}`);
        const chartData = res.data;
        
        let data= [];
            chartData.forEach((d) => {
                if (d.topic){
                let found = false;
                data.forEach((present)=>{
                    if (present.topic === d.topic){
                    found = true;
                    present.value += 1;
                    }
                })  

                if (!found){
                    data.push({topic:d.topic , value:1});
                }
            }
        })

        data.sort(function(a,b){return b.value-a.value});
        
        const cutoffIndex = 10;
        let otherValue = 0;
        let count = 0;
    
        data.forEach((d)=>{
            if (count > cutoffIndex){
                otherValue += d.value;
                d.value = 0;
            }
            count++;
        })

        data = data.filter((d)=> {
            return d.value > 0
        });

        data.push({topic:"Others" , value:otherValue});

        const colorScale = d3     
            .scaleSequential()      
            .interpolator(d3.interpolateCool)      
            .domain([0, data.length]);



        // Remove the old svg
        d3.select('#topicsGraph')
        .select('svg')
        .remove();
        // Create new svg
        const svg = d3
        .select('#topicsGraph')
        .append('svg')
        .attr('width', width)
        .attr('height', height*1.5)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${(height*1.5) / 2})`);


        const arcGenerator = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

        const pieGenerator = d3
        .pie()
        .padAngle(0)
        .value((d) => d.value);

        const arc = svg
        .selectAll()
        .data(pieGenerator(data))
        .enter();
    
        // Append sectors
        arc
        .append('path')
        .attr('d', arcGenerator)
        .style('fill', (_, i) => colorScale(i))
        .style('stroke', '#ffffff')
        .style('stroke-width', 0);


        svg.selectAll('path')
        .on('mouseover', function (event, d) {
           d3.select(this).transition()
               .duration(200)
               .attr('opacity', .2)
        })
        .on('mouseout', function (d, i) {
           d3.select(this).transition()
               .duration(200)
               .attr('opacity', 1)
        })
        .append('title')
          .text((d) => d.data.topic + " : " + d.data.value);
    }

  
    useEffect(() => {
        if(topicRef.current){
            setWidth(topicRef.current.offsetWidth);
            fetchData();
        }
    }, [topicRef.current]);


    return (
        <div className='topicCard' ref={topicRef}>
            <div id='topicsGraph'/>
            <h1>Topic Distribution</h1>
            <p>This shows the ratios of topics on which the articles have been published</p>
        </div>
    )
}

export default TopicsGraph