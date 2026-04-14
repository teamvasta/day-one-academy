// Day 1 Lead Handler - Google Apps Script
// Deployed as Version 9 on Apr 14, 2026
// This script handles form submissions from the Day 1 BJJ website.
// It saves leads to Google Sheets, sends email notifications,
// and creates Google Calendar events for booking submissions.

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var params = e.parameter;

  var firstName = params.firstName || '';
  var lastName = params.lastName || '';
  var email = params.email || '';
  var phone = params.phone || '';
  var program = params.program || '';
  var timestamp = new Date();

  // Add row to spreadsheet (unchanged — same columns as before)
  sheet.appendRow([timestamp, firstName, lastName, email, phone, program]);

  // Send email notification to your business email
  var subject = 'New Free Trial Request - ' + firstName + ' ' + lastName;
  var body = 'New lead from the Day 1 BJJ website!\n\n'
    + 'Name: ' + firstName + ' ' + lastName + '\n'
    + 'Email: ' + email + '\n'
    + 'Phone: ' + phone + '\n'
    + 'Program: ' + program + '\n'
    + 'Submitted: ' + timestamp.toLocaleString() + '\n';

  MailApp.sendEmail({
    to: 'info@day1jiujitsunewton.com',
    subject: subject,
    body: body
  });

  // Create Google Calendar event if booking date/time were provided
  var selectedDate = params.selectedDate || '';
  var selectedTime = params.selectedTime || '';
  var selectedClass = params.selectedClass || '';

  if (selectedDate && selectedTime) {
    try {
      var calendarId = 'info@day1jiujitsunewton.com';
      var calendar = CalendarApp.getCalendarById(calendarId);
      if (!calendar) {
        calendar = CalendarApp.getDefaultCalendar();
      }

      var eventDate = new Date(selectedDate);

      var timeParts = selectedTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (timeParts) {
        var hours = parseInt(timeParts[1]);
        var minutes = parseInt(timeParts[2]);
        var ampm = timeParts[3].toUpperCase();
        if (ampm === 'PM' && hours !== 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        eventDate.setHours(hours, minutes, 0, 0);
      }

      var endDate = new Date(eventDate.getTime() + 60 * 60 * 1000);

      var eventTitle = 'Free Trial - ' + firstName + ' ' + lastName + ' (' + (selectedClass || program) + ')';
      var eventDescription = 'Free Trial Class Booking\n\n'
        + 'Student: ' + firstName + ' ' + lastName + '\n'
        + 'Email: ' + email + '\n'
        + 'Phone: ' + phone + '\n'
        + 'Program: ' + program + '\n'
        + 'Class: ' + selectedClass + '\n';

      calendar.createEvent(eventTitle, eventDate, endDate, {
        description: eventDescription,
        location: '447 Centre Street, Newton, MA',
        guests: email,
        sendInvites: true
      });
    } catch (err) {
      Logger.log('Calendar error: ' + err.toString());
    }
  }

  return ContentService.createTextOutput(
    JSON.stringify({ result: 'success' })
  ).setMimeType(ContentService.MimeType.JSON);
}
