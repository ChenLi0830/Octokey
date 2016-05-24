/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-2-6
 *
 * This is used as the 'stores' of for passwordkey for encryption purpose
 *******************************************************************************/
var CryptoJS = require('crypto-js');

import Reflux from "reflux";
//import {Actions} from "./Actions.jsx";

var Actions = require("./Actions.jsx");
export const EncryptionStore = Reflux.createStore({
  listenables: [Actions],

  initKeySaltIv(hexSalt, hexIv){
    console.log("start initKeySaltIv", "hexSalt", hexSalt, "hexIv", hexIv);
    if (!this.password) {
      throw Meteor.Error("Error occurred: password is not saved in store");
    }
    if (!hexSalt || !hexIv) {//For first time user, randomly generate the salt and IV
      let salt = CryptoJS.lib.WordArray.random(256 / 8);
      hexSalt = salt.toString(CryptoJS.enc.Hex);
      let iv = CryptoJS.lib.WordArray.random(256 / 8);
      hexIv = iv.toString(CryptoJS.enc.Hex);

      Meteor.call("addEncryptionInfo", hexSalt, hexIv, function (error) {
        if (error) {
          throw new Meteor.Error(error);
        }
      });
    }

    let salt = CryptoJS.enc.Hex.parse(hexSalt);
    let Key = CryptoJS.PBKDF2(this.password, salt, {keySize: 128 / 32, iterations: 100}); //array[5]
    let hexKey = Key.toString(CryptoJS.enc.Hex);
    Session.setAuth("hexKey", hexKey);

    this.password = null;//Clear store saved password.
  },

  setPassword(password){
    this.password = password;
  },

  getPassword(){
    console.log("getPassword is called");
    return this.password;
  },


  //setPasswordKey(saltValue){
  //    this.salt = saltValue;
  //    if (!this.salt){
  //        this.salt = CryptoJS.lib.WordArray.random(256 / 8);
  //
  //    }
  //    let Key = CryptoJS.PBKDF2(this.password, this.salt, {keySize: 128 / 32, iterations: 100});
  // //array[5] let hexKey = Key.toString(CryptoJS.enc.Hex);  this.hexKey = hexKey; },
  // getPasswordKey(){ return this.hexKey; },  getSalt(){ return this.salt; }
});