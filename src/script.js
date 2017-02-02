'use strict';

const Donut = require("./donut");
const Data = require("./data");
const VDateTime = require("./datetime");

const dateToIndex = require("./dateToIndex").dateToIndex;
const jaggedDonut = Donut.jaggedDonut;
const simpleCircle = Donut.simpleCircle;

const _ = require("lodash");
const moment = require("moment");

var global_hourly_data;

var donuts = {};

const MonthToNumber = {
  'January': 1,
  'February': 2,
  'March': 3,
  'April': 4,
  'May': 5,
  'June': 6,
  'July': 7,
  'August': 8,
  'September': 9,
  'October': 10,
  'November': 11,
  'December': 12
}

function transform_count_data(data) {

  let parsed = _.map(data, (d) => {
    return {
      year: parseInt(d.Year),
      month: parseInt(d.Month),
      sensor_id: parseInt(d.Sensor_ID),
      date: parseInt(d.Mdate),
      time: parseInt(d.Time),
      count: parseInt(d.Hourly_Counts)
    }
  })


  let sorted = _.sortBy(parsed, [
    "sensor_id",
    "year",
    "month",
    "date",
    "time"
  ])


  let result = [];

  for (let sid = 1; sid < 50; sid++) {

    let sensor_one = _.filter(sorted, (d) => { return d.sensor_id === sid });

    let daily_counts = {};

    _.each(sensor_one, (d) => {

      let date_str = d.date + "-" + d.month + "-" + d.year;

      if (!daily_counts[date_str]) {
        daily_counts[date_str] = [];
      }

      daily_counts[date_str].push(d.count);

    });

    result.push(daily_counts);

  }
  console.log(JSON.stringify(result));

  return result;


}

function process_temp_data(temp_data) {

  let date_to_type = {};

  _.each(temp_data, (d) => {

    let date_str = d.Day + "-" + d.Month + "-" + d.Year;

    date_to_type[date_str] = parseInt(d.type);

  })

  return date_to_type;
}


Data.readData((data_locs, data_counts, data_temp) => {

  let locations = {};

  data_locs.forEach((d) => {
    const sid = d["Sensor ID"];
    locations[sid] = {
      street_name: d["Sensor Description"],
      lat: d["Latitude"],
      lon: d["Longitude"]
    }
  })

  /// NOTE(maxim): no need to transform pre-processed
  // data_counts = transform_count_data(data_counts);

  data_temp = process_temp_data(data_temp);

  createMap(data_locs, data_counts, data_temp, () => {});

  /// TODO: use data to create maxs and mins for 

});

function prepareDonutData(daily_counts, data_temp, tp1, tp2) {

  console.log("prepare donut data");

  const m_start = moment([tp1.y, tp1.m, tp1.d]);
  const m_end = moment([tp2.y, tp2.m, tp2.d]);

  let m_cur = m_start;

  let daily_per_hour_cold = [];
  let daily_per_hour_hot = [];

  for (let hour = 0; hour < 24; hour++) {
    daily_per_hour_cold.push([]);
    daily_per_hour_hot.push([]);
  }

  while (m_end.diff(m_cur) > 0) {

    let d = m_cur.date()
    let m = m_cur.month()
    let y = m_cur.year()
    m_cur = m_cur.add(1, 'day');

    let date_str = d + "-" + m + "-" + y;

    const counts = daily_counts[date_str];

    console.log(date_str);

    if (counts === undefined) continue;

    if (data_temp[date_str] === 0) {

      for (let hour = 0; hour < 24; hour++) {
        daily_per_hour_cold[hour].push(counts[hour]);
      }

    } else {


      for (let hour = 0; hour < 24; hour++) {
        daily_per_hour_hot[hour].push(counts[hour]);
      }

    }

  }

  let mins_cold = daily_per_hour_cold.map((hour_data) => {
    return _.min(hour_data);
  })

  let maxs_cold = daily_per_hour_cold.map((hour_data) => {
    return _.max(hour_data);
  })

  let mins_hot = daily_per_hour_hot.map((hour_data) => {
    return _.min(hour_data);
  })

  let maxs_hot = daily_per_hour_hot.map((hour_data) => {
    return _.max(hour_data);
  })

  let result = {cold: {mins: mins_cold, maxs: maxs_cold}, hot: {mins: mins_hot, maxs: maxs_hot} };

  return result;

}

function createDonut(cx, cy, hourData) {

    const svg = d3.select("svg");

    //set the min and max radius values for the donut
    var donutMinimumRadius = 60;
    var donutMaximumRadius = 80;

     //leave as false if we want to auto-scale based on min/max for this specific hourlyData dataset, otherwise can 'cap' values at this value
    var donutMinimumValue = false;
    var donutMaximumValue = false;

    var donutAngle = Math.PI; // will mostly likely just be Math.PI for semi-circle or 2*Math.PI for full circle;


    // console.log(hourData);
    //"hot" half donut
    var points = jaggedDonut(cx, cy,
      donutMinimumRadius,
      donutMaximumRadius,
      donutMinimumValue,
      donutMaximumValue,
      donutAngle, 1, hourData.hot.maxs, hourData.hot.mins) 
    let first_half = svg.append("svg:polygon")
      .attr("fill", "red")
    //.attr("stroke", "black")
      .attr("points", points);


    //"cold" half donut
    var points = jaggedDonut(cx, cy,
      donutMinimumRadius,
      donutMaximumRadius,
      donutMinimumValue,
      donutMaximumValue,
      donutAngle, -1, hourData.cold.maxs, hourData.cold.mins) 
    let second_half = svg.append("svg:polygon")
      .attr("fill", "blue")
    //.attr("stroke", "black")
      .attr("points", points);

    return [first_half, second_half];

}


function createMap(locs, data_counts, temp_data, callback){
	L.mapbox.accessToken = 'pk.eyJ1IjoidmFoYW4iLCJhIjoiY2luaWhyaDBxMHdydHUybTMzanViNzJpNCJ9.B_ndOs4dnU_XghOU9xfnSg';

	var map = L.mapbox.map('map', 'mapbox.streets',{ zoomControl:false, scrollWheelZoom :false })
		.setView([-37.8108798759503,144.960010438559], 14.3);

  map.touchZoom.disable();
  map.doubleClickZoom.disable();
  map.scrollWheelZoom.disable();
  map.boxZoom.disable();
  map.keyboard.disable();
  map.dragging.disable();

  var svg = d3.select(map.getPanes().overlayPane).append("svg").attr("width", map._size.x).attr("height", map._size.y),
    g = svg.append("g").attr("class", "leaflet-zoom-hide");

  locs.map( function(d){ var newPoint = map.latLngToLayerPoint( [d.Latitude, d.Longitude] ); d["lpoints"] = { 'x' : newPoint.x, 'y' : newPoint.y }; return d; } )

  g.selectAll("circle").data( locs ).enter().append("circle")
    .attr("cx", function(d){ return d.lpoints.x } )
    .attr("cy", function(d){ return d.lpoints.y } )
    .attr("r", 10 )
    .style("fill", "red")
    .on("mouseover", function(d, i) {

        if (donuts[i] === undefined) { donuts[i] = {}}
        if (donuts[i].shown === true) return;
        
        donuts[i].shown = true;
        var s = d3.select(this);


        let start = {d: 1, m: 12, y: 2014, h: 0};
        let end =   {d: 31, m: 12, y: 2014, h: 0};


        var hourData = prepareDonutData(data_counts[i], temp_data, start, end)

        donuts[i].svgs = createDonut(+s.attr("cx"), +s.attr("cy"), hourData);
    })
    .on("click", (d, i) => {
      donuts[i].keep = !donuts[i].keep;
    })
    .on("mouseout", (d, i) => {

      if (donuts[i].shown && !donuts[i].keep) {
        donuts[i].shown = false;
        donuts[i].svgs[0].remove();
        donuts[i].svgs[1].remove();
      }
    })
	
	callback();
}