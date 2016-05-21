/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-3-25
 *
 * Modal component for administrators to edit/app App
 *******************************************************************************/ import React from "react"

import {
    TableRow,
    TableRowColumn,
    Table,
    TableHeader,
    TableHeaderColumn,
    TableBody,
    } from "material-ui";

import _ from "lodash";

import {Modal, Form, Input, Button, Checkbox, Radio, Row, Col, Tooltip, Icon, Upload } from 'antd';
const FormItem = Form.Item;

var AppModal = React.createClass({
  propTypes: {
    modalTitle: React.PropTypes.string.isRequired,
    okText: React.PropTypes.string.isRequired,
    modalOpen: React.PropTypes.bool.isRequired,
    modalOnCancel: React.PropTypes.func.isRequired,
    modalOnOk: React.PropTypes.func.isRequired,
    onLogoUpload: React.PropTypes.func.isRequired,
    onLogoRemove: React.PropTypes.func.isRequired,
    fileList: React.PropTypes.array.isRequired,
    initialAppName: React.PropTypes.string.isRequired,
    initialLoginLink: React.PropTypes.string.isRequired,
    initialRegisterLink: React.PropTypes.string.isRequired,
    allCategories: React.PropTypes.array.isRequired,
    selectedCategories: React.PropTypes.array.isRequired,
    onCellClick: React.PropTypes.func.isRequired,
    initialPopUpLoginFlag: React.PropTypes.bool.isRequired,
    initialHomepageLink: React.PropTypes.string.isRequired,
  },

  getDefaultProps() {
    return {
      initialAppName: "",
      initialLoginLink: "",
      initialRegisterLink: "",
      initialPopUpLoginFlag: false,
      initialHomepageLink: "",
    };
  },

  getInitialState(){
    return {
      appName: this.props.initialAppName,
      loginLink: this.props.initialLoginLink,
      registerLink: this.props.initialRegisterLink,
      popUpLoginFlag: this.props.initialPopUpLoginFlag,
      homepageLink: this.props.initialHomepageLink,
    }
  },

  contextTypes: {
    intl: React.PropTypes.object.isRequired,
  },

  handleUploadLogo(logoFile){
    this.props.onLogoUpload(logoFile);
  },

  handleLogoOnChange({file, fileList}){
    if (fileList.length===0){
      this.props.onLogoRemove();
    }
  },

  handleModalOk(){
    const {appName, loginLink, registerLink, popUpLoginFlag, homepageLink} = this.state;
    this.props.modalOnOk(loginLink, registerLink, appName, popUpLoginFlag, homepageLink);
  },

  render(){
    const {messages} = this.context.intl;

    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    };

    let categoryTableRows = this.props.allCategories.map(function (category, index) {
      const categorySelected = _.indexOf(this.props.selectedCategories, category.name) > -1;
      return <TableRow key={category._id}
                       selectable={category.name!=="all"}
                       selected={categorySelected}>
        <TableRowColumn>{category.displayTitleChinese}</TableRowColumn>
      </TableRow>
    }.bind(this));

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
                  label={messages.cata_appName}>
                <Input type="text" placeholder={messages.cata_namePlaceHolder}
                       onChange={(event)=>{this.setState({appName:event.target.value})}}
                       value={this.state.appName}/>
              </FormItem>

              <FormItem
                  {...formItemLayout}
                  label={messages.cata_appHomepageLink}>
                <Input type="text" placeholder={messages.cata_homepagePlaceHolder}
                       onChange={(event)=>{this.setState({homepageLink:event.target.value})}}
                       value={this.state.homepageLink}/>
              </FormItem>

              <FormItem
                  {...formItemLayout}
                  label={messages.cata_appLoginLink}>
                <Input type="text" placeholder={messages.cata_linkPlaceHolder}
                       onChange={(event)=>{this.setState({loginLink:event.target.value})}}
                       value={this.state.loginLink}/>
              </FormItem>

              <FormItem
                  {...formItemLayout}
                  label={<span> {messages.cata_checkBoxTitle} <Tooltip title={messages.cata_checkBoxTooltip}><Icon type="question-circle-o" /></Tooltip> ：</span>}>
                <label>
                  <Checkbox
                      onChange={(event)=>{this.setState({popUpLoginFlag:event.target.checked})}}
                      checked={this.state.popUpLoginFlag}/>
                  {messages.cata_checkBoxInfo}
                </label>
              </FormItem>

              <FormItem
                  {...formItemLayout}
                  label={messages.cata_appRegisterLink}>
                <Input type="text"
                       onChange={(event)=>{this.setState({registerLink:event.target.value})}}
                       value={this.state.registerLink}/>
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
                    onChange={this.handleLogoOnChange}
                >
                  <Icon type="plus"/>
                  <div className="ant-upload-text">{messages["cata_uploadLogo-上传图片"]}</div>
                </Upload>
              </FormItem>
              <br/>
              <Table
                  height="200px"
                  fixedHeader={true}
                  fixedFooter={true}
                  selectable={true}
                  onCellClick={this.props.onCellClick}
                  multiSelectable={true}>
                <TableHeader enableSelectAll={false} displaySelectAll={false}
                             adjustForCheckbox={false}>
                  <TableRow>
                    <TableHeaderColumn style={{textAlign: 'center'}}>
                      {messages.cata_selectCategory}
                    </TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody
                    deselectOnClickaway={false}
                    showRowHover={false}
                    stripedRows={false}>
                  {categoryTableRows}
                </TableBody>
              </Table>
            </Form>
          </Modal> : null}
    </div>
  },
});

module.exports = AppModal;