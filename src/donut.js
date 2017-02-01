/*
  DONUT MODULE
*/

'use strict';

/*
    Only these will be seen from other modules
*/
module.exports = {
    jaggedDonut: jaggedDonut,
    simpleCircle: simpleCircle
}

/**

Render a half-donut based on the values in the data array

minRadius: the minimum distance from the center that a 'minimum' value in the array will be
xScale: either 1 or -1 depending on which 'side' of the circle you want to render
data: two dimensional numeric array, one array being an array of minimum values, the other being an array of maximum values

*/
function jaggedDonut(xCenter, yCenter, minRadius, donutAngle, xScale, data) {

    let points = [];

    //the radiun step for rotating around origin
    const step = Math.PI / 360.0;

    //we have to have initial rotatation of pi/2 as we want our helf-donut to be vertical, no horizontal
    const startAngle = Math.PI / 2.0;

    //rotate until we hit pi radians, plus our initial offset
    const maxAngle = donutAngle + startAngle;

    for (let theta = startAngle; theta < maxAngle; theta += step) {

        //calculate our current step by dividing current angle by pi radians (that gives us a normalized % of how far we are through a half-rotation, 
        //multiply that by how many data points we have in our data array to get the index of the radius to show
        const currentStep = (theta - startAngle);
        const pointIndex = Math.floor(currentStep / donutAngle * data.length);

        //get the radius
        const r = data[pointIndex] + minRadius;

        //calulate the points
        const x = xCenter + (r * Math.cos(theta) * xScale);
        const y = yCenter - r * Math.sin(theta);

        //store to array
        points.push([x, y]);
    }

    return points;
}

/**
circleByRadius will render points for a half circle

xScale: either 1 or -1 depending on which 'side' of the circle you want to render
*/
function circleByRadius(xCenter, yCenter, r, xScale) {

    let points = [];

    const r2 = r * r;

    for (let x = 0; x <= r; x++) {
        const y = (Math.sqrt(r2 - x * x) + 0.5);
        points.push([(xCenter + x * xScale), yCenter + y]);
    }

    for (let x = r; x > 0; x--) {
        const y = (Math.sqrt(r2 - x * x) + 0.5);
        points.push([(xCenter + x * xScale), yCenter - y]);
    }

    return points;
}

function simpleCircle(xCenter, yCenter, innerRadius) {
    return circleByRadius(xCenter, yCenter, innerRadius, 1)
            .concat(circleByRadius(xCenter, yCenter, innerRadius, -1)
            .reverse());
}