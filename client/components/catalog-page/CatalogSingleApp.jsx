/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-26
 *
 * The component for a Single App, called by "CatalogAppsBox"
 *******************************************************************************/
const {
    Row,
    Col,
    Button
    } = ReactBootstrap;

const {
    ListItem,
    Avatar,
    Divider,
    Checkbox,
    Toggle
    } = MUI;

const {
    ToggleStar,
    ToggleStarBorder
    } = SvgIcons;

CatelogSingleApp = React.createClass({
    propTypes: {
        logoURL: React.PropTypes.string.isRequired,
        appName: React.PropTypes.string.isRequired,
        loginLink: React.PropTypes.string.isRequired,
        appId: React.PropTypes.string.isRequired,
        selectedCategoryNames: React.PropTypes.array.isRequired,
        whenClicked: React.PropTypes.func.isRequired,
        subscribed: React.PropTypes.bool.isRequired,
    },

    contextTypes:{
        intl: React.PropTypes.object.isRequired,
    },

    getInitialState(){
        return {
            hovered: false
        }
    },

    handleMouseOver(){
        this.setState({
            hovered: true
        })
    },

    handleMouseOut(){
        this.setState({
            hovered: false
        })
    },

    render(){
        const {messages} = this.context.intl;
        const {logoURL,appName,loginLink,appId,selectedCategoryNames} = this.props;

        let handleToggle = this.props.subscribed ? this.handleRemove : this.handleAdd;
        let labelText = this.props.subscribed ? messages.cata_added : messages.cata_add;
        let toggleState = this.props.subscribed ? true : false;

        let toggleButton = <Toggle
            name="toggleName1"
            value="toggleValue1"
            label={labelText}
            labelPosition="right"
            labelStyle={{fontWeight:"lighter",color:ZenColor.blueGrey}}
            onToggle={handleToggle}
            defaultToggled={toggleState}/>;

        let appItem = (<Row className="single-app-row"
                            style={this.state.hovered?
                        {backgroundColor:  "#f7f7f7"}
                        :{backgroundColor:  "#ffffff"}}
                            onMouseOver={this.handleMouseOver}
                            onMouseOut={this.handleMouseOut}>
            <Col xs={5} sm={3} md={3}
                 onClick={this.props.whenClicked.bind(null, appId, appName, loginLink ,logoURL,selectedCategoryNames)}
                 style={{height:"100%", textAlign:"center"}}>
                <span className="helper"></span><img className="vertial-middle " src={logoURL}
                                                     style={{width:"50px", top:"18apx"}}/>
            </Col>
            <Col xs={2} sm={5} md={6}
                 onClick={this.props.whenClicked.bind(null, appId, appName, loginLink ,logoURL,selectedCategoryNames)}
                 className="vertical-center">{appName}</Col>
            <Col xs={5} sm={4} md={3} className="vertical-center">{toggleButton}</Col>
        </Row>);

        return <div>
            {appItem}
        </div>
    },

    handleAdd(){
        const {logoURL,appName,loginLink,appId} = this.props;
        Meteor.call("addPublicApp", appId, appName, logoURL, loginLink);
    },

    handleRemove(){
        Meteor.call("removePublicApp", this.props.appId);
    }
});