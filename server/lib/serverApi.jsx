/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-31
 *
 * ServerApi contains the global api that is used by the server
 *******************************************************************************/
localSimulateLatency = function(millisec){
    if (/localhost/.test(Meteor.absoluteUrl())) {
        Meteor._sleepForMs(millisec); //to simulate response sleep only on localhost
    }
};