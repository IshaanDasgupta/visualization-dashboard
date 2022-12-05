import * as d3 from 'd3'
import {useEffect, useRef, useState} from 'react'
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './relevanceGraph.scss';

function RelavanceGraph() {

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

    const relevanceRef = useRef(null);

    const [width,setWidth] = useState(null);

    const fetchData = async () => {

        const height = width/2;

        const res = await axios.get(`/api${queryStr}`);
        const chartData = res.data;

        const getDate = (dateInStr) =>{
            const wordArray = dateInStr.split(" ");
            var finalDate = "";
            finalDate += wordArray[2];
            finalDate += "-";
            if (wordArray[0] === "January,"){
                finalDate += "01";
            }
            if (wordArray[0] === "February,"){
                finalDate += "02";
            }
            if (wordArray[0] === "March,"){
                finalDate += "03";
            }
            if (wordArray[0] === "April,"){
                finalDate += "04";
            }
            if (wordArray[0] === "May,"){
                finalDate += "05";
            }
            if (wordArray[0] === "June,"){
                finalDate += "06";
            }
            if (wordArray[0] === "July,"){
                finalDate += "07";
            }
            if (wordArray[0] === "August,"){
                finalDate += "08";
            }
            if (wordArray[0] === "September,"){
                finalDate += "09";
            }
            if (wordArray[0] === "October,"){
                finalDate += "10";
            }
            if (wordArray[0] === "November,"){
                finalDate += "11";
            }
            if (wordArray[0] === "December,"){
                finalDate += "12";
            }
            finalDate += "-";
            finalDate += wordArray[1];
            return d3.timeParse("%Y-%m-%d")(finalDate);
        }

        
        chartData.map((d)=>{
            if (d.published){
                d.published = getDate(d.published);
            }
        })


        let data = [];
        chartData.map((d)=>{
            if (d.published){
                let found = false;
                data.map((present)=>{
                    if (present.published.getTime() === d.published.getTime()){
                        found = true;
                        if (d.relevance){
                            present.relevance += d.relevance;
                        }
                    }
                })
                if (!found && d.relevance){
                    data.push({published:d.published , relevance:d.relevance});
                }
            }
        })

        data.sort(function(a,b){
            return new Date(a.published) - new Date(b.published);
        });


        // Establish margins
        const margin = { top: 10, right: 50, bottom: 50, left: 50 };

        // establish x and y max values
        const yMaxValue = d3.max(data, d => d.relevance);
        
        d3.select('#relevanceGraph')
            .select('svg')
            .remove()

        // create chart area
        const svg = d3
            .select('#relevanceGraph')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // create scale for the x axis
        const xScale = d3
            .scaleTime()
            .domain(d3.extent(data, function(d) {return d.published}))
            .range([0, width]);
            
        // create scale for y axis
        const yScale = d3
            .scaleLinear()
            .range([height, 0])
            .domain([0, yMaxValue]);

        // create the x axis on the bottom
        svg
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height || 0})`)
            .call(d3.axisBottom().scale(xScale).tickSize(5));

        // create the y axis on the left
        svg
            .append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(yScale));

                // create a line with x and y coordinates scaled to the data
        const line = d3.line()
            .x(d => xScale(d.published))
            .y(d => yScale(d.relevance))
            .curve(d3.curveMonotoneX);

        // draw the line
        svg
            .append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', 'rgb(35, 171, 216)')
            .attr('stroke-width', 2.5)
            .attr('class', 'line') 
            .attr('d', line);
    }
    

    useEffect(()=>{
        if (relevanceRef.current){
            setWidth(relevanceRef.current.offsetWidth/1.2);
            fetchData();
        }
    }, [relevanceRef.current]);

    
  return (
  	<div className='relevanceCard' ref={relevanceRef}>
        <div id='relevanceGraph'/>
        <h1>Relavance Variation</h1>
        <p>This show how relevance of articles has varied across time. </p>
        <p>If 2 or more article have been published on the same day, they have their relevance added.</p>
    </div>

  )
}

export default RelavanceGraph;