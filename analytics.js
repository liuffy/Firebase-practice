// Here's where we're writing all of our analytics data to Firebase

// When a user opens our page, we want to save the time, the path they visited, 
// and their user agent to our list of active visitors. We'll need to create a reference
// to our activeVisitors collection before we can save to it. To create a new Firebase 
// reference, we'll do the following:

var analytics = new Firebase('https://airpair-analytics-tutorial.firebaseio.com/');
var activeVisitors = analytics.child('activeVisitors');

// You'll notice that rather than Date.now(), we're using Firebase.ServerValue.TIMESTAMP for the arrivedAt timestamp.
// This value will be replaced by Firebase when it receives our data with a timestamp from the server.
// This way, even if all our clients' clocks aren't set correctly, our data will always be in the correct order.


var visitor = {
  path: window.location.pathname,
  arrivedAt: Firebase.ServerValue.TIMESTAMP,
  userAgent: navigator.userAgent
};


var activeVisitorRef = activeVisitors.push(visitor, function () {
  activeVisitors.child(visitorId).once('value', function (snapshot) {
    visitor.arrivedAt = snapshot.child('arrivedAt').val();
    var pastVisitors = analytics.child('pastVisitors');
    visitor.leftAt = Firebase.ServerValue.TIMESTAMP;
    pastVisitors.child(visitorId).onDisconnect().set(visitor);
  });
});

var visitorId = activeVisitorRef.name();

// Remove the visitor from our active visitors when the visitor disconnects.

activeVisitorRef.onDisconnect().remove();


//  Let's reimplement our totalVisitors incrementing logic with transactions so multiple clients don't overwrite each other:

var totalVisitors = analytics.child('totalVisitors');
totalVisitors.transaction(function (currentData) {
  return currentData + 1;
});