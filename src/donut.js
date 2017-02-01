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

xCenter: x location of the donut
yCenter: y location of the donut
minRadius: the minimum radius of the donut that will be used for the 'minimum' value of the dataset - required
maxRadius: the maximum radius of the donut that will be used for the 'minimum' value of the dataset - required
minValue: the minimum value to use for the scaling, so you can 'cap' a min value that's higher than the actual min value in the dataset
            can be false if you want the system to auto-scale to the min value in the dataset
maxValue: the maximum value to use for the scaling, so you can 'cap' a max value that's lower than the actual max value in the dataset
            can be false if you want the system to auto-scale to the min value in the dataset
donutAngle: the angle of the donut in radians - generally either Math.PI or 2*Math.Pi
xScale: either 1 or -1 for the direction of the donut
maxData: the max values used for the outside of the donut
minData: the min values used for the inside of the donut
*/
function jaggedDonut(xCenter, yCenter, minRadius, maxRadius, minValue, maxValue, donutAngle, xScale, maxData, minData) 
{

    //if hardcoded max-value isn't set, loop through all values to find the max, and scale all the points based on that.
    if (maxValue === false)
    {
        maxValue = -99;

        for (var i = 0; i < maxData.length; i++)
        {
            maxValue = Math.max(maxValue, maxData[i]);
        }
    }

    //if hardcoded max-value isn't set, loop through all values to find the max, and scale all the points based on that.
    if (minValue === false)
    {
        minValue = 99;

        for (var i = 0; i < minData.length; i++)
        {
            minValue = Math.min(minValue, minData[i]);
        }
    }

    //we have to reverse the 'second' loop, whether that's min or max, as we are drawing a poly, going around once (e.g. clockwise), then looping back the other direction (e.g. counter-cw)
	return jaggedDonutOutline(xCenter, yCenter, minRadius, maxRadius, minValue, maxValue, donutAngle, xScale, maxData)
     .concat(jaggedDonutOutline(xCenter, yCenter, minRadius, maxRadius, minValue, maxValue, donutAngle, xScale, minData).reverse());

}

/**

Get data points for half of the donut (either the 'inside' or outside')

xCenter: x location of the donut
yCenter: y location of the donut
minRadius: the minimum radius of the donut that will be used for the 'minimum' value of the dataset - required
maxRadius: the maximum radius of the donut that will be used for the 'minimum' value of the dataset - required
minValue: the minimum value to use for the scaling, so you can 'cap' a min value that's higher than the actual min value in the dataset
maxValue: the maximum value to use for the scaling, so you can 'cap' a max value that's lower than the actual max value in the dataset
donutAngle: the angle of the donut in radians - generally either Math.PI or 2*Math.Pi
xScale: either 1 or -1 for the direction of the donut
maxData: the max values used for the outside of the donut
minData: the min values used for the inside of the donut
*/
function jaggedDonutOutline(xCenter, yCenter, minRadius, maxRadius, minValue, maxValue, donutAngle, xScale, data) 
{

    const valueRange = maxValue - minValue;
    const radiusRange = maxRadius - minRadius;

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

        //calculate this data point as a normalized 0-1 value
        const normalizedRange = parseFloat(Math.min(Math.max(data[pointIndex], minValue), maxValue) - minValue) / valueRange;

        //get the radius
        const r = minRadius + normalizedRange * radiusRange;

        //calulate the points
        const x = xCenter + (r * Math.cos(theta) * xScale);
        const y = yCenter - r * Math.sin(theta);

        //console.log(x + " " + y);   

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