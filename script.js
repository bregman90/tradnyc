document.addEventListener('DOMContentLoaded', function() {
  const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRJpaeCoPELQN1HraBDPrZEBZBttKS4RcVklQ20FEiIQNm7uByr9jIzvAePnLmlBXTvBSTM8UNn8sPK/pub?output=csv';

  fetch(sheetUrl)
    .then(response => response.text())
    .then(csvData => {
      const events = parseCSV(csvData);
      sortEventsByTime(events);  // Sort the events before displaying
      displayEvents(events);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
});

function parseCSV(csvData) {
  const rows = csvData.split('\n').map(row => row.split(','));
  const headers = rows.shift(); // Remove headers

  return rows.map(row => {
    const eventData = {};
    headers.forEach((header, index) => {
      eventData[header.trim()] = row[index] ? row[index].trim() : '';
    });
    return eventData;
  });
}

// Sort the events by start time (assuming Time is in a format like "HH:MM AM/PM")
function sortEventsByTime(events) {

  events.sort((a, b) => {
    const timeA = parseTime(a.Time); // Use parseTime to convert event time
    const timeB = parseTime(b.Time); // Use parseTime to convert event time
    return timeA - timeB; // Compare times (this works because Date objects can be compared by their milliseconds)
  });

}

function parseTime(timeString) {
  
  // Trim any whitespace around the time string
  timeString = timeString.trim();
  
  // Split time and modifier (AM/PM)
  const [time, modifier] = timeString.split(' ');
  
  if (!time || !modifier) {
    console.error('Time format issue:', timeString);
    return new Date(NaN); // Return Invalid Date if format is incorrect
  }
  
  const [hours, minutes] = time.split(':'); // Split into hours and minutes
  
  if (!hours || !minutes) {
    console.error('Time parsing issue:', timeString);
    return new Date(NaN); // Return Invalid Date if time format is incorrect
  }

  let hoursIn24 = parseInt(hours, 10);

  // Adjust hours for 12-hour clock
  if (modifier === 'PM' && hoursIn24 < 12) {
    hoursIn24 += 12;
  } else if (modifier === 'AM' && hoursIn24 === 12) {
    hoursIn24 = 0;
  }

  const parsedDate = new Date(0, 0, 0, hoursIn24, minutes); // Return a Date object with that time
  return parsedDate;
}

function displayEvents(events) {
  events.forEach(event => {
    const dayColumn = document.getElementById(event.Weekday);
    if (dayColumn) {
      const eventItem = document.createElement('div');
      eventItem.classList.add('event');

      // Build the event description
      let eventDescription = `<strong>${event['Venue Name']}</strong><br>`;
      
      // Add Cadence only if it's not "Weekly"
      if (event.Cadence !== "Weekly") {
        eventDescription += `(${event.Cadence})<br>`;
      }
      
      // Add Time and Borough
      eventDescription += `${event.Time} @ ${event.Borough}`;

      // Add Google Maps link if available
      if (event.Link) {
        eventDescription += `<br><a href="${event.Link}" target="_blank">Google Maps</a>`;
      }

      eventItem.innerHTML = eventDescription;
      dayColumn.appendChild(eventItem);
    }
  });
}

