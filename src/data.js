"use strict";

module.exports = {
    readData: readData
}

function readData(cb) {
  const path_locations = "data/Pedestrian_sensor_locations.csv";
  // const path_counts = "data/Pedestrian_volume__updated_monthly_.csv";
  const path_counts = "data/sample_data.csv";
  d3.csv(path_locations, (data_locations) => {
    
    console.log("opened ", path_locations);
    d3.csv(path_counts, (data_counts) => {
      console.log("opened ", path_counts)
      cb(data_locations, data_counts);

    })

  })
}