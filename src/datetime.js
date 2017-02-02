var today = new Date();
var dateInput = document.getElementById("mydate");
var timeInput = document.getElementById("mytime");

var mystartdate = "2013-01-01";
/*var dd = today.getDate();
if (String(dd).length ==1 ) dd= "0"+String(dd);
var mm = today.getMonth()+1; //January is 0!
if (String(mm).length ==1 ) mm= "0"+String(mm);
var yyyy = today.getFullYear();
var todayDate = yyyy+'-'+mm+'-'+dd;

dateInput.value = todayDate;*/
dateInput.value = mystartdate;


dateInput.setAttribute("onchange", function(){
	alert(dateInput.value);
});
timeInput.setAttribute("onchange", function(){
	if (timeInput.value == null) {
		alert("null");
	}
});



	
	

	/*
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

*/