"use strict";

module.exports = {
    readData: readData
}

const path_locations = "data/Pedestrian_sensor_locations.csv";
// const path_counts = "data/Pedestrian_volume__updated_monthly_.csv";
const path_counts = "data/sample_data.csv";
const path_temperature = "data/"

function readData(cb) {

  var data_locations;
  var data_counts;

  var p1 = new Promise((resolve, reject) => {
    d3.csv(path_locations, (data) => resolve(data))
  })

  p1.then((data) => {
    data_locations = data
  });

  var p2 = new Promise((resolve, reject) => {
    d3.csv(path_counts, (data) => resolve(data))
  })

  p2.then((data) => { data_counts = data });

  Promise.all([p1, p2]).then(() => {
    cb(data_locations, data_counts);
  })
}