var timeDisplayEl = $("#time-display");

// handle displaying the time
function displayTime() {
    var rightNow = moment().format('llll');
    timeDisplayEl.text(rightNow);
  }

// Datepicker widget
$(function () {
    $('#datepicker').datepicker({
      changeMonth: true,
      changeYear: true,
    });
  });




  displayTime();