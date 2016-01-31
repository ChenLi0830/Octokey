localSimulateLatency = function(millisec){
    if (/localhost/.test(Meteor.absoluteUrl())) {
        Meteor._sleepForMs(millisec); //to simulate longer response sleep for 2 seconds only on localhost
    }
};