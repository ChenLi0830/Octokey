/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-26
 *
 * Catalog Apps Box component - called by "Catalog"
 *******************************************************************************/
var CatalogSingleApp = require('./CatalogSingleApp.jsx');

const {
    Modal,
    Input,
    Button,
    Image,
    Panel,
    Row,
    Col,
    } = ReactBootstrap;

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
    propTypes: {
        zenApps: React.PropTypes.array.isRequired,
        zenCategories: React.PropTypes.array.isRequired,
        subscribeList: React.PropTypes.array.isRequired,
    },

    contextTypes: {
        intl: React.PropTypes.object.isRequired,
    },

    getInitialState(){
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

    handleLogoUpload(){
        let logoFile = this.refs.logoFile.refs.input.files[0];
        let reader = new FileReader();

        reader.onloadend = function () {
            this.setState({
                preview: reader.result
            });
        }.bind(this);

        reader.readAsDataURL(logoFile);
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
        event.preventDefault();
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
                    this.close();
                }.bind(this));
        } else {
            alert(this.context.intl.messages.cata_createAppAlert);
        }
        //console.log("this.props.zenApps", this.props.zenApps);
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
        const {messages} = this.context.intl;
        const publicApps = (this.props.zenApps.map(function (app) {
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

        //Todo: create a new component to separate Modal from AppsBox, catalogAppsBox component is getting too bulky.
        return <div className="layout-margin">
            <Paper zDepth={1}
                   style={{
             backgroundColor:ZenColor.white,
             padding:0,
             borderRadius:"5px"}}>
                <List style={{backgroundColor:ZenColor.white}}>
                    <Subheader>{messages.cata_listTitle}</Subheader>
                    {publicApps}
                </List>
            </Paper>

            <Modal show={this.state.showModal} onHide={this.close}>
                <Modal.Header closeButton>
                    <Modal.Title>{messages.cata_editPubApp}</Modal.Title>
                    <Button onClick={this.handleRemoveApp}>{messages.cata_removePubApp}</Button>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={this.handlePublicSubmit}>

                        <Input type="text" label={messages.cata_appName} ref="appName"
                               placeholder={messages.cata_namePlaceHolder} defaultValue={modalAttributes.appName}/>
                        <Input type="text" label={messages.cata_appLoginLink} ref="loginLink"
                               placeholder={messages.cata_linkPlaceHolder} defaultValue={modalAttributes.loginLink}/>
                        <Input type="text" label={"注册链接"/*messages.cata_appRegisterLink*/} ref="registerLink"
                               defaultValue={modalAttributes.registerLink}/>

                        <Input type="file"
                               label={messages.cata_appLogo}
                               ref="logoFile"
                               accept=".png, .jpg"
                               onChange={this.handleLogoUpload}
                               help=""/>
                        <Row>
                            <Col xs={6} md={4}>
                                <Image ref="preview" src={this.state.preview} rounded/>
                            </Col>
                        </Row>

                        <hr/>

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
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handleEditApp}>{messages.cata_editPubAppBtn}</Button>
                </Modal.Footer>
            </Modal>
        </div>
    }
});

module.exports = CatalogAppsBox;