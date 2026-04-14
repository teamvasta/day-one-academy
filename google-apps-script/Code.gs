// Day 1 Lead Handler - Google Apps Script
// Deployed as Version 10 on Apr 14, 2026
// This script handles form submissions from the Day 1 BJJ website.
// It saves leads to Google Sheets, sends email notifications,
// and creates Google Calendar events for booking submissions.
// Uses email as unique ID to prevent duplicate entries.
// Columns: A: Timestamp | B: First Name | C: Last Name | D: Full Name | E: Email | F: Phone | G: Program | H: Additional Info

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var params = e.parameter;

  var firstName = params.firstName || '';
  var lastName = params.lastName || '';
  var fullName = params.fullName || '';

  // If fullName is provided but not firstName/lastName, split it
  if (fullName && !firstName) {
    var nameParts = fullName.trim().split(' ');
    firstName = nameParts[0] || '';
    lastName = nameParts.slice(1).join(' ') || '';
  }
  // If firstName is provided but not fullName, combine them
  if (firstName && !fullName) {
    fullName = (firstName + ' ' + lastName).trim();
  }

  var email = params.email || '';
  var phone = params.phone || '';
  var program = params.program || '';
  var additionalInfo = params.additionalInfo || '';
  var timestamp = new Date();

  // Booking details (used for email/calendar but not stored in sheet)
  var selectedDate = params.selectedDate || '';
  var selectedTime = params.selectedTime || '';
  var selectedClass = params.selectedClass || '';

  // Check for duplicate by email (use email as unique ID)
  // Email is column E = index 4 (0-based)
  var existingRow = -1;
  if (email) {
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) { // skip header row
      if (data[i][4] && data[i][4].toString().toLowerCase() === email.toLowerCase()) {
        existingRow = i + 1; // Sheets are 1-indexed
        break;
      }
    }
  }

  if (existingRow > 0) {
    // Update existing row with latest info
    sheet.getRange(existingRow, 1).setValue(timestamp);       // A: Timestamp
    sheet.getRange(existingRow, 2).setValue(firstName);        // B: First Name
    sheet.getRange(existingRow, 3).setValue(lastName);         // C: Last Name
    sheet.getRange(existingRow, 4).setValue(fullName);         // D: Full Name
    // Email stays the same                                    // E: Email
    sheet.getRange(existingRow, 6).setValue(phone);            // F: Phone
    sheet.getRange(existingRow, 7).setValue(program);          // G: Program
    sheet.getRange(existingRow, 8).setValue(additionalInfo);   // H: Additional Info
  } else {
    // Add new row
    sheet.appendRow([timestamp, firstName, lastName, fullName, email, phone, program, additionalInfo]);
  }

  // Send email notification to your business email
  var subject = 'New Free Trial Request - ' + fullName;
  var body = 'New lead from the Day 1 BJJ website!\n\n'
    + 'Name: ' + fullName + '\n'
    + 'Email: ' + email + '\n'
    + 'Phone: ' + phone + '\n'
    + 'Program: ' + program + '\n';

  if (additionalInfo) {
    body += 'Additional Info: ' + additionalInfo + '\n';
  }
  if (selectedDate && selectedTime) {
    body += 'Date: ' + selectedDate + '\n'
      + 'Time: ' + selectedTime + '\n'
      + 'Class: ' + selectedClass + '\n';
  }
  body += 'Submitted: ' + timestamp.toLocaleString() + '\n';

  MailApp.sendEmail({
    to: 'info@day1jiujitsunewton.com',
    subject: subject,
    body: body
  });

  // Create Google Calendar event if booking date/time were provided
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

      var eventTitle = 'Free Trial - ' + fullName + ' (' + (selectedClass || program) + ')';
      var eventDescription = 'Free Trial Class Booking\n\n'
        + 'Student: ' + fullName + '\n'
        + 'Email: ' + email + '\n'
        + 'Phone: ' + phone + '\n'
        + 'Program: ' + program + '\n'
        + 'Class: ' + selectedClass + '\n';

      if (additionalInfo) {
        eventDescription += 'Additional Info: ' + additionalInfo + '\n';
      }

      // Use Advanced Calendar API to create event without Google Meet
      var eventResource = {
        summary: eventTitle,
        description: eventDescription,
        location: '447 Centre Street, Newton, MA',
        start: { dateTime: eventDate.toISOString() },
        end: { dateTime: endDate.toISOString() },
        attendees: [{ email: email }],
        conferenceData: null,
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 1440 } // 1 day before
          ]
        }
      };

      Calendar.Events.insert(eventResource, calendarId, {
        sendUpdates: 'all',
        conferenceDataVersion: 0
      });
    } catch (err) {
      Logger.log('Calendar error: ' + err.toString());
    }
  }

  return ContentService.createTextOutput(
    JSON.stringify({ result: 'success' })
  ).setMimeType(ContentService.MimeType.JSON);
}
