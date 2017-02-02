const dateToIndexMap = require('./dateToIndexMapping');

module.exports = {
  dateToIndex: function(d, m, y) {
    let date_str = d + '-' + m + '-' + y;
    return dateToIndexMap[date_str];
  }
}

/// 1st of Jan 2013
const StartYear = 2013;
const StartMon  = 1;
const StartDay  = 1;

// 30th Nov 2016
const EndYear = 2016; 
const EndMon =  12;
const EndDay =  30;

const datyInMonthRatherThanFeb = [
  31, // Jan
  NaN,
  31, // Mar
  30, // Apr
  31, // May
  30, // Jun
  31, // Jly
  31, // Aug
  30, // Sep
  31, // Oct
  30, // Nov
  31  // Dec
];

function daysInYear(year) {
  return (year % 4 === 0) ? 366 : 365;
}

function daysInMonth(mon, year) {
  
  /// Special case for Feb
  if (mon === 2) {
    if (year % 4 === 0) { return 29 } else { return 28 }
  }

  return datyInMonthRatherThanFeb[mon - 1];
}


function dateToIndex(day, mon, year) {

  let days = 0;

  for (let y = StartYear; y < year; y++) {
    days += daysInYear(y);
  }

  for (let m = StartMon; m < mon; m++) {
    days += daysInMonth(m, year);
  }

  days += day;

  return days - 1;
}


// let prev = -1;

// console.log(dateToIndex(31,12,2013))

// let result = {};
// let indexToDateMap = {}

// const HOURS_IN_DAY = 24;

// for (let y = StartYear; y <= EndYear; y++) {
//   for (let m = StartMon; m <= EndMon; m++) {
//     for (let d = StartDay; d <= daysInMonth(m, y); d++) {
//       let index = dateToIndex(d, m, y) * HOURS_IN_DAY;

//       if (prev + 24 !== index) { console.log("something is wrong", y, m, d); }

//       let date_str = d + '-' + m + '-' + y;

//       indexToDateMap[index] = {day: d, month: m, year: y};

//       prev = index;
//     }
//   }
// }
// console.log(JSON.stringify(result));



