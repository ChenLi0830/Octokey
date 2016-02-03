/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-26
 *
 * Catalog Apps Box component - called inside Catalog component
 *******************************************************************************/
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
    TableBody
    } = MUI;

const MUITable = MUI.Table;

const {
    NavigationExpandMoreIcon
    } = SvgIcons;

let modalAttributes = {
    appName: "",
    loginLink: "",
    logoURL: "",
    selectedCategoryNames: [],
};

const {FormattedMessage} = ReactIntl;

CatalogAppsBox = React.createClass({
    propTypes: {
        zenApps: React.PropTypes.array.isRequired,
        zenCategories: React.PropTypes.array.isRequired,
        subscribedPublicApps: React.PropTypes.array.isRequired,
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
            logoURL: "",
            selectedCategoryNames: [],
        };
    },

    open() {//for modal
        this.setState({showModal: true});
    },

    propTypes: {
        zenApps: React.PropTypes.array.isRequired,
        zenCategories: React.PropTypes.array.isRequired
    },

    handleClick(appId, appName, loginLink, logoURL, selectedCategoryNames){
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
        const appName = this.refs.appName.refs.input.value;

        if (loginLink && appName && this.state.preview !== "") {
            //Todo 显示等待条,或者其他gif
            Meteor.call("updateZenApp", this.state.editAppId, appName, loginLink, this.state.preview,
                modalAttributes.selectedCategoryNames,
                function (error, result) {
                    if (error) {
                        throw new Meteor.Error(error);
                    }
                    this.close();
                }.bind(this));
        } else {
            alert(<FormattedMessage id="cata_createAppAlert"/>);
        }
        //console.log("this.props.zenApps", this.props.zenApps);
    },

    handleRemoveApp(event){
        event.preventDefault();
        var delConfirm = confirm(<FormattedMessage id="cata_confirmDel"/>);
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
        const publicApps = (this.props.zenApps.map(function (app) {
                let logoURL = getLogoUrl(app._id);
                let subscribed = _.findIndex(this.props.subscribedPublicApps, function (subscribedApp) {
                        return subscribedApp.appId === app._id
                    }) > -1;
                return <CatelogSingleApp key={app._id}
                                         logoURL={logoURL}
                                         appName={app.appName}
                                         loginLink={app.loginLink}
                                         selectedCategoryNames={app.categoryNames}
                                         whenClicked={this.handleClick}
                                         appId={app._id}
                                         subscribed={subscribed}/>
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
             backgroundColor:"#ffffff",
             padding:0,
             borderRadius:"5px"}}>
                <List subheader={<FormattedMessage id="cata_listTitle"/>} style={{backgroundColor:"white"}}>
                    {publicApps}
                </List>
            </Paper>

            <Modal show={this.state.showModal} onHide={this.close}>
                <Modal.Header closeButton>
                    <Modal.Title><FormattedMessage id="cata_editPubApp"/></Modal.Title>
                    <Button onClick={this.handleRemoveApp}><FormattedMessage id="cata_removePubApp"/></Button>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={this.handlePublicSubmit}>
                        <FormattedMessage id="cata_namePlaceHolder">
                            {(formattedValue)=>(
                                <Input type="text" label={<FormattedMessage id="cata_appName"/>} ref="appName"
                                       placeholder={formattedValue}/>
                            )}
                        </FormattedMessage>

                        <FormattedMessage id="cata_linkPlaceHolder">
                            {(formattedValue)=>(
                                <Input type="text" label={<FormattedMessage id="cata_appLoginLink"/>} ref="loginLink"
                                       placeholder={formattedValue}/>
                            )}
                        </FormattedMessage>

                        <Input type="file"
                               label={<FormattedMessage id="cata_appLogo"/>}
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
                                        <FormattedMessage id="cata_selectCategory"/>
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
                    <Button onClick={this.handleEditApp}><FormattedMessage id="cata_editPubAppBtn"/></Button>
                </Modal.Footer>
            </Modal>
        </div>
    }
});