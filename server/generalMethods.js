Meteor.methods({
    inDevMode(){
        localSimulateLatency(500);
        return process.env.NODE_ENV === "development";
    }
});