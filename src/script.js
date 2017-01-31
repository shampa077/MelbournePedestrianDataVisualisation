'use strict';

const Donut = require("./donut");
const Data = require("./data");
const jaggedHalfDonut = Donut.jaggedHalfDonut;
const simpleCircle = Donut.simpleCircle;


// Data.readData((data_locs, data_counts) => {
//   console.log(data_locs)
//   console.log(data_counts)
//   console.log("hello")
// });

// dummy data to print a 'gear', doesn't really matter if min or max array is first
var maxs = [40, 50, 40, 50, 40, 50, 40, 50, 40, 50, 90, 50, 40, 50, 40, 50, 40, 50, 40, 50, 40, 50, 40, 50];
var mins = [0, 20, 10, 20, 10, 20, 10, 20, 10, 20, 10, 20, 10, 20, 10, 20, 10, 20, 10, 20, 10, 20, 10, 20];
var hourData = [maxs, mins];

var donutCenterX = 200;
var donutCenterY = 200;
var minimumDonutRadius = 70;


//"hot" half donut

var points = jaggedHalfDonut(donutCenterX, donutCenterY, minimumDonutRadius, 1, hourData[0])
                .concat(jaggedHalfDonut(donutCenterX, donutCenterY, minimumDonutRadius, 1, hourData[1]).reverse());

//we have to reverse the 'second' loop, whether that's min or max, as we are drawing a poly, going around once (e.g. clockwise), then looping back the other direction (e.g. counter-cw)
var canvas = d3.select("svg")
.append("svg:polygon")
.attr("fill", "red")
//.attr("stroke", "black")
.attr("points", points);


//"cold" half donut

//we have to reverse the 'second' loop, whether that's min or max, as we are drawing a poly, going around once (e.g. clockwise), then looping back the other direction (e.g. counter-cw)
var points = jaggedHalfDonut(donutCenterX, donutCenterY, minimumDonutRadius, -1, hourData[0])
                .concat(jaggedHalfDonut(donutCenterX, donutCenterY, minimumDonutRadius, -1, hourData[1]).reverse());
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