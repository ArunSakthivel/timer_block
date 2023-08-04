var SDK = require('blocksdk');
const moment = require('moment-timezone');
var sdk = new SDK(null, null, true); // 3rd argument true bypassing https requirement: not prod worthy

var date, time, zone, link, name;

// Get all timezones
const timezones = moment.tz.names();

// Create an array to hold the timezone options
const timezoneOptions = [];

// Iterate over the timezones and create options with timezone offsets
for (const timezone of timezones) {
	const offset = moment.tz(timezone).utcOffset() / 60;
	const offsetString = offset >= 0 ? `+${offset}` : `${offset}`;
	const option = {
		value: offset,
		label: `(UTC ${offsetString}) ${timezone}`,
	};
	timezoneOptions.push(option);
}

const selectElement = document.getElementById('timezoneSelect');

// Clear existing options (if any)
selectElement.innerHTML = '';

// Create and append options to the select element
timezoneOptions.forEach(option => {
	const optionElement = document.createElement('option');
	optionElement.value = option.value;
	optionElement.textContent = option.label;
	selectElement.appendChild(optionElement);
});

function debounce (func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}
function paintMap() {
	date = document.getElementById('datepicker-3u434879').value;
    time = document.getElementById('timepicker').value;
    zone = document.getElementById('timezoneSelect').value;

	const today_date = new Date();
    const timezoneOffsetInMinutes = today_date.getTimezoneOffset();
    const timezoneOffsetInHours = timezoneOffsetInMinutes / 60;

    var today = new Date(new Date().getTime()+(11*24*60*60*1000));
    var month = today.getMonth()+1;
    date = ""+today.getFullYear()+"-"+month+"-"+today.getDate();
    time = ""+today.getHours()+":"+today.getMinutes();
    var zone = timezoneOffsetInHours;

	updateCountdown(date,time,zone);
}

sdk.getData(function (data) {
	targetDateTime = data.targetDateTime || '';
	name = data.name || '';
	paintMap();
});

document.getElementById('datepicker-3u434879').addEventListener('change', function() {
	var date = document.getElementById('datepicker-3u434879').value;
	var time = document.getElementById('timepicker').value;
	var zone = document.getElementById('timezoneSelect').value;
	updateCountdown(date,time,zone);
});

document.getElementById('timepicker').addEventListener('change', function() {
	var date = document.getElementById('datepicker-3u434879').value;
	var time = document.getElementById('timepicker').value;
	var zone = document.getElementById('timezoneSelect').value;
	updateCountdown(date,time,zone);
});

document.getElementById('timezoneSelect').addEventListener('change', function() {
	var date = document.getElementById('datepicker-3u434879').value;
	var time = document.getElementById('timepicker').value;
	var zone = document.getElementById('timezoneSelect').value;
	updateCountdown(date,time,zone);
});

function updateCountdown(date,time,zone){
	name = Math.random().toString(36).substring(2,7);
	// Split the date, time, and timezone components
	var [year, month, day] = date.split('-');
	var [hour, minute] = time.split(':');
  
	// Create a new date with the components
	var targetDateTime = new Date(year, month - 1, day, hour, minute);
  
	// Adjust for the timezone offset
	var timezoneOffset = (Number(zone) * 60);
	targetDateTime.setMinutes(targetDateTime.getMinutes() + timezoneOffset);

	var url = 'https://countdown-app-c08243e819dc.herokuapp.com/countdown?time=' +
	targetDateTime + '&width=300&height=250&name='+name+'&bg=5a8dd8&color=050707';
	sdk.setContent('<a href="' + link + '"><img src="' + url + '" /></a>');
	sdk.setData({
		targetDateTime: targetDateTime,
		name: name
	});
}