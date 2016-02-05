/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-31
 *
 * "generalMethods" declares the methods that is not related to any specific collection
 *******************************************************************************/
Meteor.methods({
    inDevMode(){
        localSimulateLatency(500);
        return process.env.NODE_ENV === "development";
    }
});