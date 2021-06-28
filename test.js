const moment = require('moment');

// var startDate = moment('01-01-2021');
// var endDate = moment('06-01-2021');

// var dates = [];
// endDate.subtract(1, "month"); //Substract one month to exclude endDate itself

// var month = moment(startDate); //clone the startDate
// while( month < endDate ) {
//     month.add(1, "month");
//     dates.push(month.format('M/DD/YYYY'));
// }

// console.log(dates);
var startDate = moment('2021-01-01');
var endDate = moment('2021-06-01');

const result = [];

if (endDate.isBefore(startDate)) {
    throw "End date must be greated than start date."
}      

//https://www.sportstoto.com.my/results_past.asp?date=6/01/2021
const month_url = 'https://www.sportstoto.com.my/results_past.asp?date='
while (startDate.isSameOrBefore(endDate)) {
    let print_url = month_url.concat(startDate.format("M/DD/YYYY").toString());
    result.push(print_url);
    startDate.add(1, 'month');
}
console.log(result);