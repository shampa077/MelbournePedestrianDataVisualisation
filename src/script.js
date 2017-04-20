'use strict';

      const path_locations = "data/Pedestrian_sensor_locations.csv";
// const path_counts = "data/Pedestrian_volume__updated_monthly_.csv";
// const path_counts = "data/sample_data.csv";
// const path_counts = "data/CountData2013-2016.csv";
const path_counts = "data/pre-processed.json";

const path_temperature = "data/TempData2013-2016.csv"

console.log(path_locations);

 d3.csv(path_locations,function (data){
     
     for (var i in data)
         console.log(data[i]);
 });



/*
const Donut = require("./donut");
//console.log(Data);




const VDateTime = require("./datetime");

const dateToIndex = require("./dateToIndex").dateToIndex;
const jaggedDonut = Donut.jaggedDonut;
const simpleCircle = Donut.simpleCircle;

const _ = require("lodash");
const moment = require("moment");

var global_hourly_data;
var global_data_counts;

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
  global_data_counts = data_counts;
  createMap(data_locs, data_counts, data_temp, () => {});

  /// TODO: use data to create maxs and mins for 

});

function prepareDonutData(daily_counts, data_temp, tp1, tp2) {

  console.log(daily_counts);

  const m_start = moment([tp1.y, tp1.m, tp1.d]);
  const m_end = moment([tp2.y, tp2.m, tp2.d]);

  let m_cur = m_start;

  let daily_per_hour_cold = [];
  let daily_per_hour_hot = [];

  for (let hour = 0; hour < 24; hour++) {
    daily_per_hour_cold.push([1]);
    daily_per_hour_hot.push([1]);
  }

  while (m_end.diff(m_cur) > 0) {

    let d = m_cur.date()
    let m = m_cur.month()
    let y = m_cur.year()
    const day_of_week = m_cur.day();
    m_cur = m_cur.add(1, 'day');

    let date_str = d + "-" + m + "-" + y;

    const counts = daily_counts[date_str];

    // console.log(counts)


    if (counts === undefined) continue;

    const mode = document.getElementById("mode").value;

    const cold_day = (data_temp[date_str] === 0);
    const is_weekend = (day_of_week == 1 || day_of_week == 2);

    if ((cold_day && mode == "temp") || (!is_weekend && mode == "weekday")) {

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
    if (hour_data.length < 0) return 1;
    return _.min(hour_data);
  })

  let maxs_cold = daily_per_hour_cold.map((hour_data) => {
    if (hour_data.length < 0) return 1;
    return _.max(hour_data);
  })

  let mins_hot = daily_per_hour_hot.map((hour_data) => {
    if (hour_data.length < 0) return 1;
    return _.min(hour_data);
  })

  let maxs_hot = daily_per_hour_hot.map((hour_data) => {
    if (hour_data.length < 0) return 1;
    return _.max(hour_data);
  })

  let result = {cold: {mins: mins_cold, maxs: maxs_cold}, hot: {mins: mins_hot, maxs: maxs_hot} };

  console.log(result);

  return result;

}

function createDonut(cx, cy, hourData) {

    const svg = d3.select("svg");

    //set the min and max radius values for the donut
    var donutMinimumRadius = 20;
    var donutMaximumRadius = 80;

     //leave as false if we want to auto-scale based on min/max for this specific hourlyData dataset, otherwise can 'cap' values at this value
    var donutMinimumValue = false;
    var donutMaximumValue = false;

    var donutAngle = Math.PI * 2; // will mostly likely just be Math.PI for semi-circle or 2*Math.PI for full circle;


    // console.log(hourData);
    //"hot" half donut
    var points = jaggedDonut(cx, cy,
      donutMinimumRadius,
      donutMaximumRadius,
      donutMinimumValue,
      donutMaximumValue,
      donutAngle, -1, hourData.hot.maxs, hourData.hot.mins) 
    let first_half = svg.append("svg:polygon")
      .attr("fill", "red")
      .attr("opacity", 0.5)
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
      .attr("opacity", 0.5)
    //.attr("stroke", "black")
      .attr("points", points);

    return [first_half, second_half];

}


function createMap(locs, data_counts, temp_data, callback){
	L.mapbox.accessToken = 'pk.eyJ1IjoidmFoYW4iLCJhIjoiY2luaWhyaDBxMHdydHUybTMzanViNzJpNCJ9.B_ndOs4dnU_XghOU9xfnSg';

	var map = L.mapbox.map('map', 'mapbox.streets',{ zoomControl:false, scrollWheelZoom :false })
		.setView([-37.8108798759503,144.960010438559], 14);
		
		//map.zoom = 140;

		map.getPane('tilePane').style.opacity = 0.4;
		
  map.touchZoom.disable();
  map.doubleClickZoom.disable();
  map.scrollWheelZoom.disable();
  map.boxZoom.disable();
  map.keyboard.disable();
  map.dragging.disable();

  var svg = d3.select(map.getPanes().overlayPane).append("svg").attr("width", map._size.x).attr("height", map._size.y),
    g = svg.append("g").attr("id","mapg").attr("class", "leaflet-zoom-hide");

  locs.map( function(d){ var newPoint = map.latLngToLayerPoint( [d.Latitude, d.Longitude] ); d["lpoints"] = { 'x' : newPoint.x, 'y' : newPoint.y }; return d; } );
  
  var loctypes =["Attraction","Dining","Entertainment","Housing","Library","Meeting","Office","Park","Shopping","Station","Street","University"];
  var mycolor = d3.scaleOrdinal(d3.schemeCategory20);

  g.selectAll("circle").data( locs ).enter().append("circle")
    .attr("cx", function(d){ return d.lpoints.x } )
    .attr("cy", function(d){ return d.lpoints.y } )
    .attr("r", function(d,i){
		
		var selectedDateText = document.getElementById("mydate").value;
		var selectedDate = new Date(selectedDateText);
		var day = selectedDate.getDate();
		var month = selectedDate.getMonth()+1;
		var year = selectedDate.getFullYear();
		var date_idx = day+"-"+month+"-"+year;
		var selectedTime = document.getElementById("mytime").value;
		//var xidx = dateToIndex(day,month,year);
		//xidx = xidx + parseInt(selectedTime);
		var time_idx = parseInt(selectedTime);
		var radius;
		
		var sensor_idx = parseInt(d["Sensor ID"]);
		if (data_counts[sensor_idx-1] == null) radius = 0;
		else if (data_counts[sensor_idx-1][date_idx] == null) radius= 0;
		else radius= data_counts[sensor_idx-1][date_idx][time_idx] / 200;
		
		return radius;


	})
    .style("fill", function(d){
		
		var xidx = loctypes.indexOf(d["Location Type"]);
		if (xidx == -1) xidx = loctypes.length;
		var thecolor = mycolor(xidx);
		return thecolor;
		
	})
    .on("mouseover", function(d, i) {
		console.log(d);
        if (donuts[i] === undefined) { donuts[i] = {}}
        if (donuts[i].shown === true) return;
        
        donuts[i].shown = true;
        var s = d3.select(this);

        let start = {d: 1, m: 7, y: 2013, h: 0};
        let end =   {d: 1, m: 10, y: 2016, h: 0};

        const sid = parseInt(d["Sensor ID"]);

        console.log("sid:", sid)

        var hourData = prepareDonutData(data_counts[sid - 1], temp_data, start, end)

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
    });
	
	
	var catSvg = d3.select("#categories").append("svg").attr("width",800).attr("height",75);
	catSvg.selectAll("circle").data(loctypes).enter().append("circle").attr("cx",function(d,i){
		if (i > 5) return (i - 5)*140 - 130;
		else return (i+1)*140 - 130;
		})
		.attr("cy", function(d,i){
		if (i > 5) return 50;
		else return 15;
		}).attr("r",10).style("fill", function(d,i){return mycolor(i);});
	catSvg.selectAll("text").data(loctypes).enter().append("text").attr("x",function(d,i){
		if (i > 5) return (i - 5)*140 - 107;
		else return (i+1)*140 - 107;
		})
		.attr("y", function(d,i){
			if (i > 5) return 55;
		else return 20;
			
		}).text(function(d){return d;});
	
	callback();
}




var dateInput = document.getElementById("mydate");
var timeInput = document.getElementById("mytime");
var slider = document.getElementById("myslider");

dateInput.addEventListener("click", function(){
	clearTitle();
	updateSensors();
});

timeInput.addEventListener("click", function(){
	updateSensors();
});

function clearTitle(){
	document.getElementById("mytitle").innerHTML = "Melbourne Pedestrian Count";
}

var incident = document.getElementById("incident");
var incidents = [{"name":"Christmas 2015","date":"2015-12-25"},{"name":"State Elections 2014", "date":"2014-11-29"}, {"name":"Federal Elections 2013", "date":"2013-09-07"}, {"name":"Christmas 2014","date":"2014-12-25"}, {"name":"Lunar New Year 2013","date":"2013-02-10"}];

incident.addEventListener("click", function(){
	var ri = Math.floor((Math.random() * incidents.length) + 0);
	document.getElementById("mytitle").innerHTML = "Melbourne Pedestrian Count - "+incidents[ri].name;//.text(incidents[ri].name).attr("x","50%").attr("y",10);
	dateInput.value = incidents[ri].date;
	updateSensors();
});

function updateSensors(){
	var tmpg = d3.select("#mapg");
	tmpg.selectAll("circle").transition().attr("r", function(d,i){
							
							var selectedDateText = document.getElementById("mydate").value;
							var selectedDate = new Date(selectedDateText);
							var day = selectedDate.getDate();
							var month = selectedDate.getMonth()+1;
							var year = selectedDate.getFullYear();
							var date_idx = day+"-"+month+"-"+year;
							var selectedTime = document.getElementById("mytime").value;
							var time_idx = parseInt(selectedTime);
							var radius;
							
							var sensor_idx = parseInt(d["Sensor ID"]);
							if (global_data_counts[sensor_idx-1] == null) radius = 0;
							else if (global_data_counts[sensor_idx-1][date_idx] == null) radius= 0;
							else radius= global_data_counts[sensor_idx-1][date_idx][time_idx] / 200;
		
							return radius;
	});
}

//transport_select.setAttribute("onchange", function(){toggleSelect(transport_select_id);});
*/