/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2016-5-1
 *
 * Import Web Apps
 *******************************************************************************/

var fs = require('fs');
require('../../public/js/jquery.csv.min');
var CryptoJS = require('crypto-js');

var path = '/homePage缩减版300.csv';
var logoFile;

startImport = function () {
  console.log("start read data");

  $.ajax({
    type: "GET",
    error: function (error) {
      console.log('error; ', error);
    },
    url: path,
    dataType: "text",
    success: function (data) {
      processData(data);
    }
  });

  /*  $.ajax({
   type: "GET",
   error: function (error) {
   console.log('error; ', error);
   },
   url: "/Icons/1DF1F405BA12E67D20E59488558714BC.png",
   dataType: "text",
   success: function (data) {
   logoFile = data;
   }
   });*/
  setTimeout(function () {
    console.log("logoFile", logoFile)
  }, 2000);
}

function processData(data) {
  console.log("start process data");
  console.log("data", data);
  const dataObj = $.csv.toObjects(data);
  console.log("dataObj", dataObj);

  function timeoutLoop(fn, index, delay) {//async的for循环
    if (index < dataObj.length)
      setTimeout(function () {
        fn(index);
        timeoutLoop(fn, index + 1, delay);
      }, delay);
  }

  function loopFunc(index) {// Async for 循环里要执行的function, 用来call handleAddApp
    var app = dataObj[index];
    const appName = app.sf1,
        popUpLoginFlag = app.ff3 === "弹出式",
        loginLink = app.ff3 === "弹出式" || app.ff3 === "原地址" ? app.f2 : app.ff3,
        homepageLink = app.f2,
        registerLink = "";

    const logoFileName = getLogoName(homepageLink);

    console.log("logoFileName", logoFileName);
    toDataUrl("/Icons/" + logoFileName + ".png", function (base64result) {
      var logo = "";
      //console.log("base64result", base64result);
      //console.log("finish loading! app:", appName);
      var resultType = base64result.split(',')[0];
      console.log("resultType", resultType);
      if (resultType==="data:image/png;base64"){//返回结果是image/png, 表示logo文件存在
        logo = base64result;
      }
      handleAddApp(loginLink, registerLink, appName, popUpLoginFlag, homepageLink, logo);
    });
  }

  // pass your function as callback
  timeoutLoop(loopFunc, 0, 3000);
}

function getLogoName(homepage){
  const domainName = homepage.split('//')[1];
  //console.log("domainName", domainName);
  var hash = CryptoJS.MD5(domainName);
  //console.log("hash", hash);
  const md5 = CryptoJS.enc.Hex.stringify(hash);
  //console.log("md5", md5);
  return md5.toUpperCase();
}

function toDataUrl(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function () {
    var reader = new FileReader();
    reader.onloadend = function () {
      callback(reader.result);
    };
    reader.readAsDataURL(xhr.response);
  };
  xhr.onerror = function(error){
    console.log("error", error);
  };
  xhr.open('GET', url);
  xhr.send();
}

/**
 * Handle Public App Add
 * @param {string} loginLink - The login link from modal form
 * @param {string} [registerLink=""] - The register link from modal form
 * @param {string} appName  - The login link from modal form
 * @param {boolean} popUpLoginFlag  - flag whether the user needs to click "登录" before actually
 * fill in credentials
 * @param {string} homepageLink - Home page link
 * @param {blob} logo - image logo
 */
function handleAddApp(loginLink, registerLink, appName, popUpLoginFlag, homepageLink, logo) {
  const selectedCategories = ["all"];
  console.log("appName: ", appName, ", popUpLoginFlag: ", popUpLoginFlag, ", loginLink: ",
      loginLink, ", homepageLink: ", homepageLink, ", registerLink")

  Meteor.call("checkAppExistsByName", appName, function (error, result) {
    if (error) {
      throw new Meteor.Error(error);
    }
    if (!result) {//If App doesn't exist, add the app into
      Meteor.call("addPublicApp", appName, loginLink, registerLink, logo, selectedCategories,
          popUpLoginFlag, homepageLink,
          function (error) {
            if (error) {
              console.log("error", error);
            }
          }.bind(this)
      );
    } else {
      console.log("App already exist", appName);
    }
  });
}


