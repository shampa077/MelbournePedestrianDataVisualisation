'use strict';

const Donut = require("./donut");
const Data = require("./data");
const jaggedDonut = Donut.jaggedDonut;
const simpleCircle = Donut.simpleCircle;


Data.readData((data_locs, data_counts) => {

  let locations = {};

  data_locs.forEach((d) => {
    const sid = d["Sensor ID"];
    locations[sid] = {
      street_name: d["Sensor Description"],
      lat: d["Latitude"],
      lon: d["Longitude"]
    }
  })

  let data = {};
  
  data_counts.forEach((d) => {

    const sid = d.Sensor_ID;

    if (data[sid] === undefined) {
      data[sid] = [];
    }

    data[sid].push(d.Hourly_Counts);
  })

  prepareDonutData(data[1]);

  /// TODO: use data to create maxs and mins for 

});

function prepareDonutData(data) {
  let hourData = [];

  const no_days = data.length / 24;

  for (let hour = 0; hour < 24; hour++) {
    hourData.push([]);
    for (let day = 0; day < no_days; day++) {
      const idx = hour + day * 24;

      hourData[hour].push(data[idx]);
    }
  }

  let result = {mins: [], maxs: []};
  /// for each hour figure out the min and the max
  for (let hour = 0; hour < 24; hour++) {

    console.log(hourData[hour])
    const max = Math.max.apply(null, hourData[hour]);
    const min = Math.min.apply(null, hourData[hour]);
    console.log(min)
    console.log(max)

    result.mins.push(min);
    result.maxs.push(max);
  }

  // console.log(result);
  createDonut(result);
}

function createDonut(hourData) {
    // dummy data to print a 'gear', doesn't really matter if min or max array is first
    var maxs = [40, 50, 40, 50, 40, 50, 40, 50, 40, 50, 90, 50, 40, 50, 40, 50, 40, 50, 40, 50, 40, 50, 40, 50];
    var mins = [0, 20, 10, 20, 10, 20, 10, 20, 10, 20, 10, 20, 10, 20, 10, 20, 10, 20, 10, 20, 10, 20, 10, 20];
    // var hourData = {maxs: maxs, mins: mins};

    var donutCenterX = 200;
    var donutCenterY = 200;
    var minimumDonutRadius = 70;
    var donutAngle = Math.PI; // will mostly likely just be Math.PI for semi-circle or 2*Math.PI for full circle;


    //"hot" half donut

    var points = jaggedDonut(donutCenterX, donutCenterY, minimumDonutRadius, donutAngle, 1, hourData.maxs)
                    .concat(jaggedDonut(donutCenterX, donutCenterY, minimumDonutRadius, donutAngle, 1, hourData.mins).reverse());

    //we have to reverse the 'second' loop, whether that's min or max, as we are drawing a poly, going around once (e.g. clockwise), then looping back the other direction (e.g. counter-cw)
    var canvas = d3.select("svg")
    .append("svg:polygon")
    .attr("fill", "red")
    //.attr("stroke", "black")
    .attr("points", points);


    //"cold" half donut

    //we have to reverse the 'second' loop, whether that's min or max, as we are drawing a poly, going around once (e.g. clockwise), then looping back the other direction (e.g. counter-cw)
    var points = jaggedDonut(donutCenterX, donutCenterY, minimumDonutRadius, donutAngle, -1, hourData.maxs)
                    .concat(jaggedDonut(donutCenterX, donutCenterY, minimumDonutRadius, donutAngle, -1, hourData.mins).reverse());
    var canvas = d3.select("svg")
    .append("svg:polygon")
    .attr("fill", "blue")
    //.attr("stroke", "black")
    .attr("points", points);


    //reference circle in the middle

    points = simpleCircle(200, 200, 70);
    var canvas = d3.select("svg")
    .append("svg:polygon")
    .attr("fill", "grey")
    //.attr("stroke", "black")
    .attr("points", points);
}
