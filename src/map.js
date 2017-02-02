
//set the max min of slider
var maxtime;
var mintime;

var mystartdate = "2010-01-01";
var millisecondsPerDay = 24 * 60 * 60 * 1000;

function treatAsUTC(date) {
    var result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
}

function daysBetween(startDate, endDate) {
    
    return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
}

function reverseDaysBetween(startDate, count) {
	var a = count * millisecondsPerDay;
	var b = treatAsUTC(a) + treatAsUTC(startDate);
	//var c = 
}

maxtime = (daysBetween(mystartdate, "2013-12-31"));
mintime = 1;




	function dateChange(){
		alert(document.getElementById("mytime").value);
	}
	
	function timeChange(){
		if (this.value == null) {
		alert("null");
		}
	}

	var today = new Date();
	var dd = today.getDate();
	if (String(dd).length ==1 ) dd= "0"+String(dd);
	var mm = today.getMonth()+1; //January is 0!
	if (String(mm).length ==1 ) mm= "0"+String(mm);
	var yyyy = today.getFullYear();
	var todayDate = yyyy+'-'+mm+'-'+dd;
	document.getElementById('mydate').value = todayDate;
	
	L.mapbox.accessToken = 'pk.eyJ1IjoidmFoYW4iLCJhIjoiY2luaWhyaDBxMHdydHUybTMzanViNzJpNCJ9.B_ndOs4dnU_XghOU9xfnSg';
	var map = L.mapbox.map('map', 'mapbox.streets',{ zoomControl:false, scrollWheelZoom :false })
		.setView([-37.8117000422788,144.965210438559], 15);
	
	map.touchZoom.disable();
	map.doubleClickZoom.disable();
	map.scrollWheelZoom.disable();
	map.boxZoom.disable();
	map.keyboard.disable();
	map.dragging.disable();
	map.keyboard.disable();
	
	
	
	//var svg = d3.select(map.getPanes().overlayPane).append("svg").attr("width", document.documentElement.clientWidth).attr("height", document.documentElement.clientHeight),
	var svg = d3.select(map.getPanes().overlayPane).append("svg").attr("width", 800).attr("height", 600),
    g = svg.append("g").attr("class", "leaflet-zoom-hide");
	
	
	var data = [];
	d3.csv("sensors.csv", function(sensors){
			for (var i = 0; i < sensors.length; i++) {
				  data.push({"id": sensors[i]["Sensor ID"], "oldcoords" : [ parseFloat(sensors[i].Latitude), parseFloat(sensors[i].Longitude)], "count": 0});
				}
				
		d3.csv("volumes.csv", function(volumes){
				for (var i = 0; i < volumes.length; i++) {
					for (var j =0; j<data.length;j++){
						if (data[j].id == volumes[i]["Sensor_ID"]) data[j].count = data[j].count+ parseInt(volumes[i]["Hourly_Counts"]);
				  }
				}
				
				data.map( function(d){ var newPoint = map.latLngToLayerPoint( d.oldcoords ); d["coords"] = { 'x' : newPoint.x, 'y' : newPoint.y }; return d; } )
	
				g.selectAll("circle").data( data ).enter().append("circle")
				.attr("cx", function(d){ return d.coords.x } )
				.attr("cy", function(d){ return d.coords.y } )
				.attr("r", function(d){return d.count / 1000000;} )
				.style("fill", "blue")
				.on("mouseover", function(d) {
				console.log( String(d.oldcoords));
					});
				});
		});


document.getElementById("myslider").min = mintime;
document.getElementById("myslider").max = maxtime;
document.getElementById("myslider").value = (daysBetween(mystartdate, todayDate));
function sliderChanged(e){
	reverseDaysBetween(mystartdate, e.value);
}