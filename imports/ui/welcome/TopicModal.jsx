/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-3-25
 *
 * Modal component for administrators to edit/app App
 *******************************************************************************/
import React from "react";

import Modal from "antd/lib/modal";
import Form from "antd/lib/form";
import Input from "antd/lib/input";
import Button from "antd/lib/button";
import Checkbox from "antd/lib/checkbox";
import Radio from "antd/lib/radio";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Tooltip from "antd/lib/tooltip";
import Icon from "antd/lib/icon";
import Upload from "antd/lib/upload";
const FormItem = Form.Item;

var TopicModal = React.createClass({
  propTypes: {
    modalTitle: React.PropTypes.string.isRequired,
    okText: React.PropTypes.string.isRequired,
    modalOpen: React.PropTypes.bool.isRequired,
    modalOnCancel: React.PropTypes.func.isRequired,
    modalOnOk: React.PropTypes.func.isRequired,
    onLogoUpload: React.PropTypes.func.isRequired,
    fileList: React.PropTypes.array.isRequired,
    topicName: React.PropTypes.string.isRequired,
    topicRank: React.PropTypes.string.isRequired,
    //allCategories: React.PropTypes.array.isRequired,
    //selectedCategories: React.PropTypes.array.isRequired,
    //onCellClick: React.PropTypes.func.isRequired,
  },

  getDefaultProps() {
    return {
      topicName: "",
      topicRank: "",
    };
  },

  contextTypes: {
    intl: React.PropTypes.object.isRequired,
  },

  handleUploadLogo(logoFile){
    this.props.onLogoUpload(logoFile);
  },

  handleModalOk(){
    const topicName = this.refs.topicName.refs.input.value;
    const topicRank = this.refs.topicRank.refs.input.value;
    this.props.modalOnOk(topicName, topicRank);
  },

  render(){
    const {messages} = this.context.intl;

    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    };


    return <div>
      {this.props.modalOpen ?
          <Modal title={this.props.modalTitle}
                 visible={this.props.modalOpen}
                 onCancel={this.props.modalOnCancel}
                 onOk={this.handleModalOk}
                 okText={this.props.okText}
          >
            <Form horizontal>
              <FormItem
                  {...formItemLayout}
                  label={"兴趣名址："/*messages.cata_appName*/}>
                <Input type="text" ref="topicName"
                       placeholder={"例如: 创业"/*messages.cata_namePlaceHolder*/}
                       defaultValue={this.props.topicName}/>
              </FormItem>
              <FormItem
                  {...formItemLayout}
                  label={"兴趣排名："/*messages.cata_appLoginLink*/}>
                <Input type="text" ref="topicRank"
                       placeholder={"例如: 3.1415926"/*messages.cata_linkPlaceHolder*/}
                       defaultValue={this.props.topicRank}/>
              </FormItem>

              <FormItem
                  label={messages.cata_appLogo}
                  help={messages["cata_logoRequirement-上传要求"]}
                  {...formItemLayout}>
                <Upload
                    action="ItIsHandledByBeforeUpload"
                    listType="picture-card"
                    fileList={this.props.fileList}
                    beforeUpload={this.handleUploadLogo}
                >
                  <Icon type="plus"/>
                  <div className="ant-upload-text">{messages["cata_uploadLogo-上传图片"]}</div>
                </Upload>
              </FormItem>
              <br/>

            </Form>
          </Modal> : null}
    </div>
  },
});

module.exports = TopicModal;