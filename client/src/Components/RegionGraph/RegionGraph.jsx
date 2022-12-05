import * as d3 from 'd3'
import {useEffect, useRef, useState} from 'react'
import * as topojson from 'topojson'
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './regionGraph.scss';

function RegionGraph() {

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

    const regionRef = useRef(null);

    const [width,setWidth] = useState(null);

    const fetchData = async () => {
        
        const height = width/2;

        const res = await axios.get(`/api${queryStr}`);
        const chartData = res.data;

        let dataFromChart = [];
        let total =  0;
        chartData.map((d)=>{
            if (d.country){
                total += 1;
                let found = false;
                dataFromChart.map((present) => {
                    if (present.country === d.country){
                        found = true;
                        present.value += 1;
                    }
                })

                if (!found){
                    dataFromChart.push({country:d.country , value:1})
                }
            }
        })

        dataFromChart.map((element) => {
             element.opacityValue = element.value/total;
         })



        d3.select('#regionGraph')
            .select('svg')
            .remove()

        // create chart area
        const svg = d3
            .select('#regionGraph')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')

        const scale = (width/835)*100;

        const projection = d3.geoMercator()
            .scale(scale)
            .translate([(width)/2 , (height)/1.4]);

        const path = d3.geoPath(projection);

        const g = svg.append('g');


        const jsonUrl = 'https://unpkg.com/world-atlas@2.0.2/countries-50m.json';

        d3.json(jsonUrl).then((data) => {
            const countries = topojson.feature(data , data.objects.countries);

            countries.features.forEach((d)=>{
                dataFromChart.forEach((valueData) => {
                    if (valueData.country === d.properties.name){
                        d.value = valueData.value;
                        d.opacityValue = valueData.opacityValue;
                    }
                })
            })

            g.selectAll('path')
                .data(countries.features)
                .enter()
                .append('path')
                .attr('class' , 'country')
                .attr('d' , path)
                .style('opacity', function(d) {
                    return d.opacityValue* 3 + 0.2;
                })
                .append('title')
                .text(d => d.properties.name + " : " + (d.value || 0));

        })
    }
    

    useEffect(()=>{   
        if (regionRef.current){
            setWidth(regionRef.current.offsetWidth);
            fetchData();
        }
    } , [regionRef.current]);

    
  return (
  	<div className='regionCard' ref={regionRef}>
        <div id='regionGraph'/>
        <br />
        <h1>World Map</h1>
        <br />
        <p>The countries in the map are colored accroding to the intensity of the number of article published in them.</p>
        <p>Articles whos countries are not mentioned are excluded from this graph</p>
    </div>
  )
}

export default RegionGraph;