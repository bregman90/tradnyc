document.addEventListener('DOMContentLoaded', function() {
  const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRJpaeCoPELQN1HraBDPrZEBZBttKS4RcVklQ20FEiIQNm7uByr9jIzvAePnLmlBXTvBSTM8UNn8sPK/pub?output=csv';

  fetch(sheetUrl)
    .then(response => response.text())
    .then(csvData => {
      const events = parseCSV(csvData);
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

function displayEvents(events) {
  events.forEach(event => {
    const dayColumn = document.getElementById(event.Weekday);
    if (dayColumn) {
      const eventItem = document.createElement('div');
      eventItem.classList.add('event');
      eventItem.innerHTML = `
        <strong>${event['Venue Name']}</strong> (${event.Cadence})<br>
        ${event.Time} @ ${event.Borough}
        ${event.Link ? `<br><a href="${event.Link}" target="_blank">More Info</a>` : ''}
      `;
      dayColumn.appendChild(eventItem);
    }
  });
}
