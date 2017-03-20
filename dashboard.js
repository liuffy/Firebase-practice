
var analytics = new Firebase('https://airpair-analytics-tutorial.firebaseio.com/');


// UPDATING VALUES

// Let's first update the total visitors tally, since that only represents a single value.
$(document).on('ready', function () {
  var $totalVisitors = $('#total-visitors');
  analytics.child('totalVisitors').on('value', function (snapshot) {
    $totalVisitors.text(snapshot.val());
  });
});


// It's important to note that 'child_added' events are fired for each child when they are 
// first attached using on and then again for new children after your application has loaded.
// This conveniently allows you to keep all your logic in one place instead of requesting the
// data initially and then trying to keep it in sync as updates come in.

var $activeVisitors = $('#active-visitors');
// var activeVisitors = analytics.child('activeVisitors');

// We call endAt() on our reference to tell Firebase we want to perform our query at the 
// end of our data set, then limit(3) to limit our query to 3 records

var activeVisitors = analytics.child('activeVisitors').endAt().limit(3);


// Every time a 'child_added' event is fired, we're adding a new <li> element to our initially
// empty <ul> element. It contains the generated ID of our visitor and displays the visitor data
// in bullet points


activeVisitors.on('child_added', function (snapshot) {
  var n = snapshot.name();
  var v = snapshot.val();
  $activeVisitors.prepend(
  '<li id="active-visitor' + n + '">' + n + ':' +
    '<ul>' +
      '<li>Arrived: ' + new Date(v.arrivedAt) + '</li>' +
      '<li>Path: ' + v.path + '</li>' +
      '<li>User Agent: ' + v.userAgent + '</li>' +
    '</ul>' + 
  '</li>'
  );
});

activeVisitors.on('child_removed', function (snapshot) {
  $('#active-visitor' + snapshot.name()).remove(); 
});


// We'll add very similar code for displaying past visitors as well. This time, 
// we'll also display when they left as well as how long they were visiting the page in seconds.
var $pastVisitors = $('#past-visitors');
// var pastVisitors = analytics.child('pastVisitors');
var pastVisitors = analytics.child('pastVisitors').endAt().limit(3);
pastVisitors.on('child_added', function (snapshot) {
  var n = snapshot.name();
  var v = snapshot.val();
  $pastVisitors.prepend(
  '<li id="past-visitor' + n + '">' + n + ':' +
    '<ul>' +
      '<li>Arrived: ' + new Date(v.arrivedAt) + '</li>' +
      '<li>Left: ' + new Date(v.leftAt) + '</li>' +
      '<li>Spent: ' + ((v.leftAt - v.arrivedAt) / 1000) + ' Seconds </li>' +
      '<li>Path: ' + v.path + '</li>' +
      '<li>User Agent: ' + v.userAgent + '</li>' +
    '</ul>' + 
  '</li>'
  );
});

//  You'll notice that as more visitors leave, our dashboard never removes the oldest visits and the number
 // displayed exceeds 3. We can handle this just like we did before, by adding a 'child_removed' handler.
pastVisitors.on('child_removed', function (snapshot) {
    $('#past-visitor' + snapshot.name()).remove(); 
  });

