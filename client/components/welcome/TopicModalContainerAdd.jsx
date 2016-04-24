/*******************************************************************************
 * Copyright (C) 2016 Octokey Inc.
 *
 * Creator: Chen Li<chen.li@oyaoshi.com>
 * Creation Date: 2016-4-8
 *
 * The container for TopicModal component. It is used to add a new Topic.
 *******************************************************************************/

const TopicModal = require('./TopicModal.jsx');

const TopicModalContainerAdd = React.createClass({
  propTypes: {
    modalOpen: React.PropTypes.bool.isRequired,
    onModalClose: React.PropTypes.func.isRequired,
    //allCategories: React.PropTypes.array.isRequired,
  },

  contextTypes: {
    intl: React.PropTypes.object.isRequired,
  },

  getInitialState(){
    return {
      iconPreview: "",
      //selectedCategories: ["all"],
    }
  },

  render(){
    const fileList = [{
      uid: -1,
      status: 'done',
      url: this.state.iconPreview
    }];

    return <TopicModal
        modalTitle={"添加兴趣"}
        okText={"添加"}
        modalOpen={this.props.modalOpen}
        modalOnCancel={this.handleModalClose}
        modalOnOk={this.handleAddTopic}
        onLogoUpload={this.handleLogoUpload}
        fileList={fileList}
        //allCategories={this.props.allCategories}
        //selectedCategories={this.state.selectedCategories}
        //onCellClick={this.handleCellClick}
    />
  },

  /**
   * Handle Topic Add
   * @param {string} name - The name of the topic
   * @param {number} rank - The rank fo the topic
   */
  handleAddTopic(name, rank){
    const icon = this.state.iconPreview;
    //const {selectedCategories} = this.state;

    if (name && rank && icon !== "") {
      Meteor.call("addTopic", name, icon, rank,
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
  },

  /**
   * To preview the logo uploaded to the browser (the logo is not uploaded to the server yet)
   * @param {Blob} logoFile - The blob file uploaded
   * @returns {boolean} false - Stop the default action of antd 'Upload' component
   */
  handleLogoUpload(logoFile){
    OctoClientAPI.checkImageFile(logoFile, function (err, imageFile) {
      if (err) {
        alert("error: " + err);
      }
      else {
        this.setState({
          iconPreview: imageFile,
        });
      }
    }.bind(this));
    return false;
  },

  /**
   * Close the modal and set the state to the value in "getInitialState"
   */
  handleModalClose(){
    console.log("close modal");
    this.props.onModalClose();
    //Wait 0.5 sec to reset the state so that user won't see the change during the cancel animation
    setTimeout(()=> {
      this.setState({
        iconPreview: "",
        //selectedCategories: ["all"],
      })
    }, 500);
  },

});

module.exports = TopicModalContainerAdd;
