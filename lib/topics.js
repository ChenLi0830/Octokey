/*******************************************************************************
 * Copyright (C) 2015 Octokey Inc.
 *
 * Creator: Chen Li<chen.li@oyaoshi.com>
 * Creation Date: 2016-4-8
 *
 * It declares methods for Topics collection.
 *******************************************************************************/
Topics.allow({
  download: function () {
    return true;
  }
});

//topicName, icon, shownPosition, followCount, top100AppsOverall, top100AppsLastweek,
// top100AppsLastMonth

Meteor.methods({
  /**
   * Add a new topic
   * @param {string} name - Topic name.
   * @param {string} icon - Icon in base64
   * @param {number} rank - The ranked position it is shown on the page
   */
  addTopic(name, icon, rank){
    localSimulateLatency(500);

    checkAdmin.call(this);

    let topic = new FS.File(icon);

    topic.name = name;
    topic.rank = rank;
    topic.followCount = 0;
    topic.topAppsOverall = [];
    topic.topAppsLastWeek = [];
    topic.topAppsLastMonth= [];

    Topics.insert(topic, function (error, fileObj) {
      if (error) {
        throw new Meteor.Error(error);
      } else {//Logo uploaded successful
        const imagesURL = "/cfs/files/topics/" + fileObj._id;
        console.log("insert app successfully, imageURL=" + imagesURL);
      }
    });
  },

  /**
   * Remove a topic
   * @param {string} topicId - Topic Id
   */
  removeTopic(topicId){
    localSimulateLatency(500);
    checkAdmin.call(this);
    Topics.remove({_id: topicId});
  },

  /**
   * Add app in topApps of a specific topic
   * @param {string} appId
   * @param {string} appName
   * @param {number} rank - The rank of the app in the top list
   * @param {string} topicId
   * @param {('overall'|'week'|'month')} topPeriod - topApps is added to which time period
   */
  addAppToTopic(appId, appName, rank, topicId, topPeriod){
    localSimulateLatency(500);
    checkAdmin.call(this);

    let documentName;
    topPeriod==="overall" && (documentName="topAppsOverall");
    topPeriod==="week" && (documentName="topAppsLastWeek");
    topPeriod==="month" && (documentName="topAppsLastMonth");

    let qry = {};
    qry[documentName] = {
      appId: appId,
      appName: appName,
      rank: rank,
    };

    Topics.update(
        {_id:topicId},
        {$addToSet:qry}
    );
  },

  /**
   * Remove app in topApps of a specific topic
   * @param {string} appId
   * @param {string} topicId
   * @param {('overall'|'week'|'month')} topPeriod - topApps is added to which time period
   */
  removeAppInTopic(appId, topicId, topPeriod){
    localSimulateLatency(500);
    checkAdmin.call(this);

    let documentName;
    topPeriod==="overall" && (documentName="topAppsOverall");
    topPeriod==="week" && (documentName="topAppsLastWeek");
    topPeriod==="month" && (documentName="topAppsLastMonth");

    let qry = {};
    qry[documentName] = {appId: appId};

    Topics.update(
        {_id:topicId},
        {$pull:qry}
    );
  },

  //Todo Create Add new Topic modal, come up with list, find icons and add new topics
  //Todo add method - user follow topic
  //Todo add method - add topxApps

});