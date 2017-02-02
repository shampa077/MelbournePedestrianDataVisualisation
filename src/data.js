"use strict";

/// total days: 1461
/// invalid: -5555

module.exports = {
    readData: readData
}

const path_locations = "data/Pedestrian_sensor_locations.csv";
// const path_counts = "data/Pedestrian_volume__updated_monthly_.csv";
// const path_counts = "data/sample_data.csv";
// const path_counts = "data/CountData2013-2016.csv";
const path_counts = "data/pre-processed.json";

const path_temperature = "data/TempData2013-2016.csv"

function readData(cb) {

  var data_locations;
  var data_counts;
  var data_temp;

  var p1 = new Promise((resolve, reject) => {
    d3.csv(path_locations, (data) => resolve(data))
  })

  p1.then((data) => { data_locations = data });

  var p2 = new Promise((resolve, reject) => {
    d3.json(path_counts, (data) => resolve(data))
  })

  p2.then((data) => { data_counts = data });

  var p3 = new Promise((resolve, reject) => {
    d3.csv(path_temperature, (data) => resolve(data));
  })

  p3.then((data) => { data_temp = data; })

  Promise.all([p1, p2, p3]).then(() => {
    cb(data_locations, data_counts, data_temp);
  })
}