/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-3-26
 *
 * The container for AppModal component. It is used to add a new App.called by CatalogSingleApp
 *******************************************************************************/

const AppModal = require('./AppModal.jsx');

const AppModalContainerAdd = React.createClass({
  propTypes: {
    modalOpen: React.PropTypes.bool.isRequired,
    allCategories: React.PropTypes.array.isRequired,
    onModalClose: React.PropTypes.func.isRequired,
  },

  contextTypes: {
    intl: React.PropTypes.object.isRequired,
  },

  getInitialState(){
    return {
      logoPreview: "",
      selectedCategories: ["all"],
    }
  },

  render(){
    const fileList = [{
      uid: -1,
      status: 'done',
      url: this.state.logoPreview
    }];

    return <AppModal
        modalTitle={"添加网站"}
        okText={"添加"}
        modalOpen={this.props.modalOpen}
        modalOnCancel={this.handleModalClose}
        modalOnOk={this.handleAddApp}
        onLogoUpload={this.handleLogoUpload}
        fileList={fileList}
        allCategories={this.props.allCategories}
        selectedCategories={this.state.selectedCategories}
        onCellClick={this.handleCellClick}
    />
  },

  /**
   * Handle Public App Add
   * @param {string} loginLink - The login link from modal form
   * @param {string} [registerLink=""] - The register link from modal form
   * @param {string} appName  - The login link from modal form
   * @param {string | Blob} logo
   */
  handleAddApp(loginLink, registerLink, appName){
    const logo = this.state.logoPreview;
    const {selectedCategories} = this.state;

    if (loginLink && appName && logo !== "") {
      Meteor.call("addPublicApp", appName, loginLink, registerLink, logo, selectedCategories,
          function (error) {
            if (error) {
              console.log("error", error);
            } else {
              this.handleModalClose();
            }
          }.bind(this)
      );
    } else {
      alert(this.context.intl.messages.cata_createAppAlert);
    }

    /*      //Todo 显示等待条,或者其他gif
     Meteor.call("updatePublicApp", this.props.appId, newAppName, newLoginLink, newRegisterLink,
     newLogo,
     this.state.selectedCategories, function (error, result) {
     if (error) {
     throw new Meteor.Error(error);
     }

     //Fetch updated data from publicApps collection
     OctoAPI.fetchDataToSession("allPublicApps", "getAllPublicApps");

     //Close modal
     this.props.onModalClose();
     }.bind(this));*/
  },

  /**
   * To preview the logo uploaded to the browser (the logo is not uploaded to the server yet)
   * @param {Blob} logoFile - The blob file uploaded
   * @returns {boolean} false - Stop the default action of antd 'Upload' component
   */
  handleLogoUpload(logoFile){
    OctoAPI.checkImageFile(logoFile, function (err, imageFile) {
      if (err) {
        alert("error: " + err);
      }
      else {
        this.setState({
          logoPreview: imageFile,
        });
      }
    }.bind(this));
    return false;
  },

  /**
   * Handle click on category cell, either select or un-select a category for an app
   * @param {string} rowNumber - Row number of clicked category
   * @param {string} columnId
   */
  handleCellClick(rowNumber, columnId){
    console.log("onCellClick called");
    var selectedCategoryName = this.props.allCategories[rowNumber].name;
    var index = this.state.selectedCategories.indexOf(selectedCategoryName);
    //react state is immutable, use this variable to act as a temp var.
    var selectedCategories = this.state.selectedCategories;

    if (index > -1) {//already selected
      selectedCategories.splice(index, 1);
      this.setState({selectedCategories: selectedCategories});
    }
    else {
      selectedCategories.push(selectedCategoryName);
      this.setState({selectedCategories: selectedCategories});
    }
  },

  /**
   * Close the modal and set the state to the value in "getInitialState"
   */
  handleModalClose(){
    this.props.onModalClose();
    //Wait 0.5 sec to reset the state so that user won't see the change during the cancel animation
    setTimeout(()=> {
      this.setState({
        logoPreview: "",
        selectedCategories: ["all"],
      })
    }, 500);
  },

  /**
   * Handle remove a public app
   * @param {string} appId - the id of the to-be-removed app
   */
  /*handleRemoveApp(event){
   event.preventDefault();
   var delConfirm = confirm(this.context.intl.messages.cata_confirmDel);
   if (delConfirm) {
   Meteor.call("removePublicApp", this.state.editAppId, function (error, result) {
   if (error) {
   throw new Meteor.Error(error);
   }
   this.close();
   }.bind(this));
   }
   },*/
});

module.exports = AppModalContainerAdd;
