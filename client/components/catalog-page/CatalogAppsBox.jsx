/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-26
 *
 * Catalog Apps Box component - called by "Catalog"
 *******************************************************************************/
var CatalogSingleApp = require('./CatalogSingleApp.jsx');
var AppLoading = require('../AppLoading.jsx');
const {
    Paper,
    RaisedButton,
    List,
    TableRow,
    TableRowColumn,
    Table,
    TableHeader,
    TableHeaderColumn,
    TableBody,
    } = MUI;

import {Modal, Form, Input, Button, Checkbox, Radio, Row, Col, Tooltip, Icon, Upload } from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

import Subheader from 'material-ui/lib/Subheader';

const {
    NavigationExpandMoreIcon
    } = SvgIcons;

let modalAttributes = {
    appName: "",
    loginLink: "",
    registerLink: "",
    logoURL: "",
    selectedCategoryNames: [],
};

var CatalogAppsBox = React.createClass({
    mixins: [ReactMeteorData,],

    getMeteorData(){
        if (this.needFetchApps) {
            //console.log("fetch new apps");
            Session.clear("appsOfChosenCategory"),
            OctoAPI.fetchDataToSession("appsOfChosenCategory", "getPublicAppsOfCategory", this.props.chosenCategory);
            this.needFetchApps = false;
        }
        const subsHandles = [
            Session.get("appsOfChosenCategory"),
        ];
        return {
            subsReady: OctoAPI.subsHandlesAreReady(subsHandles),
        };
    },

    componentWillReceiveProps(nextProps){
        if (nextProps.chosenCategory !== this.props.chosenCategory) {
            //Apps should only be fetched if the user chose a different category
            this.needFetchApps = true;
        }
    },

    propTypes: {
        zenCategories: React.PropTypes.array.isRequired,
        subscribeList: React.PropTypes.array.isRequired,
        chosenCategory: React.PropTypes.string.isRequired,
    },

    contextTypes: {
        intl: React.PropTypes.object.isRequired,
    },

    getInitialState(){
        //needFetchApps is used for determine whether new apps should be fetched
        this.needFetchApps = true;
        return {
            showModal: false,
            preview: null,
            editAppId: null,
        }
    },

    close() {//for modal
        this.setState({
            showModal: false,
            preview: null,
            editAppId: null
        });

        modalAttributes = {
            appName: "",
            loginLink: "",
            registerLink: "",
            logoURL: "",
            selectedCategoryNames: [],
        };
    },

    open() {//for modal
        this.setState({showModal: true});
    },

    handleClick(appId, appName, loginLink, registerLink, logoURL, selectedCategoryNames){
        if (!isAdmin(Meteor.user())) {
            return
        }

        this.setState({
            preview: logoURL,
            editAppId: appId
        });
        modalAttributes = {
            appName: appName,
            loginLink: loginLink,
            logoURL: logoURL,
            registerLink: registerLink,
            selectedCategoryNames: selectedCategoryNames,
        };
        //console.log("modalAttributes",modalAttributes);

        this.open();//open时会rerender modal里的值,把modalAttributes的值填进去
    },

    /** Handle file uploaded to the browser, not to the server yet **/
    handleLogoUpload(logoFile){
        let reader = new FileReader();
        reader.readAsDataURL(logoFile);

        reader.onloadend = function () {
            this.setState({
                preview: reader.result,
            });
        }.bind(this);

        //Stop file from being uploaded to server
        return false;
    },

    onCellClick(rowNumber, columnId){
        var selectedCategoryName = this.props.zenCategories[rowNumber].name;
        var index = modalAttributes.selectedCategoryNames.indexOf(selectedCategoryName);
        if (index > -1) {//already selected
            modalAttributes.selectedCategoryNames.splice(index, 1);
        }
        else {
            modalAttributes.selectedCategoryNames.push(selectedCategoryName);
        }
        console.log("modalAttributes.selectedCategoryNames", modalAttributes.selectedCategoryNames);
    },

    handleEditApp(event){
        //console.log("modalAttributes.selectedCategoryNames", modalAttributes.selectedCategoryNames);
        //console.log("this.state.preview", this.state.preview);
        const loginLink = this.refs.loginLink.refs.input.value;
        const registerLink = this.refs.registerLink.refs.input.value;
        const appName = this.refs.appName.refs.input.value;

        if (loginLink && appName && this.state.preview !== "") {
            //Todo 显示等待条,或者其他gif
            Meteor.call("updateZenApp", this.state.editAppId, appName, loginLink, registerLink, this.state.preview,
                modalAttributes.selectedCategoryNames,
                function (error, result) {
                    if (error) {
                        throw new Meteor.Error(error);
                    }

                    //Fetch updated data from publicApps collection
                    OctoAPI.fetchDataToSession("allPublicApps", "getAllPublicApps");
                    this.close();
                }.bind(this));
        } else {
            alert(this.context.intl.messages.cata_createAppAlert);
        }
    },

    handleRemoveApp(event){
        event.preventDefault();
        var delConfirm = confirm(this.context.intl.messages.cata_confirmDel);
        if (delConfirm) {
            Meteor.call("removeZenApp", this.state.editAppId, function (error, result) {
                if (error) {
                    throw new Meteor.Error(error);
                }
                this.close();
            }.bind(this));
        }
    },

    render(){
        if (!this.data.subsReady) {
            return <AppLoading/>
        }

        const {messages} = this.context.intl;
        const appsOfChosenCategory = (Session.get("appsOfChosenCategory").map(function (app) {
                let logoURL = getLogoUrl(app._id);
                let subscribed = this.props.subscribeList[app._id];
                return <CatalogSingleApp key={app._id}
                                         logoURL={logoURL}
                                         appName={app.appName}
                                         loginLink={app.loginLink}
                                         registerLink={app.registerLink}
                                         selectedCategoryNames={app.categoryNames}
                                         whenClicked={this.handleClick}
                                         appId={app._id}
                                         subscribed={subscribed}
                                         subsCount={app.subscribeCount}
                />
            }.bind(this))
        );

        let categoryTableRows = this.state.showModal ?
            this.props.zenCategories.map(function (category, index) {
                const categorySelected = _.indexOf(modalAttributes.selectedCategoryNames, category.name) > -1;
                //console.log("categorySelected", categorySelected);
                //console.log("modalAttributes.selectedCategoryNames", modalAttributes.selectedCategoryNames);
                return <TableRow key={category._id}
                                 selectable={category.name!=="all"}
                                 selected={categorySelected}>
                    <TableRowColumn>{category.displayTitleChinese}</TableRowColumn>
                </TableRow>
            }.bind(this)) : null;

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        //Todo: create a new component to separate Modal from AppsBox, catalogAppsBox component is getting too bulky.
        return <div className="layout-margin">
            <Paper zDepth={1}
                   style={{
             backgroundColor:ZenColor.white,
             padding:0,
             borderRadius:"5px"}}>
                <List style={{backgroundColor:ZenColor.white}}>
                    <Subheader>{messages.cata_listTitle}</Subheader>
                    {appsOfChosenCategory}
                </List>
            </Paper>

            <Modal title={messages.cata_editPubApp}
                   visible={this.state.showModal}
                   onCancel={this.close}
                   onOk={this.handleEditApp}
                   okText={messages.cata_editPubAppBtn}
            >

                {modalAttributes.appName!=="" ?
                    <Form horizontal>
                    <FormItem
                        {...formItemLayout}
                        label={messages.cata_appName}>
                        <Input type="text" ref="appName"
                               placeholder={messages.cata_namePlaceHolder} defaultValue={modalAttributes.appName}/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={messages.cata_appLoginLink}>
                        <Input type="text" ref="loginLink"
                               placeholder={messages.cata_linkPlaceHolder} defaultValue={modalAttributes.loginLink}/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={messages.cata_appRegisterLink}>
                        <Input type="text" ref="registerLink"
                               defaultValue={modalAttributes.registerLink}/>
                    </FormItem>

                    <FormItem
                        label={messages.cata_appLogo}
                        help={"logo可能会被cache,如果发现修改没有反应，请clear cache"/*messages*/}
                        {...formItemLayout}>
                        <Upload
                            action="ItIsHandledByBeforeUpload"
                            listType="picture-card"
                            fileList={[{
                                uid: -1,
                                status: 'done',
                                url: this.state.preview
                            }]}
                            beforeUpload={this.handleLogoUpload}
                        >
                            <Icon type="plus" />
                            <div className="ant-upload-text">上传照片</div>
                        </Upload>
                    </FormItem>

                        <Table
                            height="200px"
                            fixedHeader={true}
                            fixedFooter={true}
                            selectable={true}
                            onCellClick={this.onCellClick}
                            multiSelectable={true}>
                            <TableHeader enableSelectAll={false} displaySelectAll={false} adjustForCheckbox={false}>
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

                </Form> : null}
            </Modal>
        </div>
    }
});

module.exports = CatalogAppsBox;