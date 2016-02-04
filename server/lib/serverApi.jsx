localSimulateLatency = function(millisec){
    if (/localhost/.test(Meteor.absoluteUrl())) {
        Meteor._sleepForMs(millisec); //to simulate response sleep only on localhost
    }
};