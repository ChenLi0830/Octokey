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

CatalogSingleApp = React.createClass({
    propTypes: {
        logoURL: React.PropTypes.string.isRequired,
        appName: React.PropTypes.string.isRequired,
        loginLink: React.PropTypes.string.isRequired,
        registerLink: React.PropTypes.string,
        appId: React.PropTypes.string.isRequired,
        selectedCategoryNames: React.PropTypes.array.isRequired,
        whenClicked: React.PropTypes.func,
        subscribed: React.PropTypes.bool.isRequired,
        condensed: React.PropTypes.bool,
        subsCount:React.PropTypes.number,
    },

    getDefaultProps: function() {
        return {
            condensed: false,
            whenClicked: ()=>{},
            subsCount:0,
        };
    },

    contextTypes: {
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
        const {logoURL,appName,loginLink,registerLink,appId,selectedCategoryNames, condensed,subsCount} = this.props;

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
                            style={{backgroundColor : this.state.hovered? "#f7f7f7" : "#ffffff", minWidth:"340px"}}
                            onMouseOver={this.handleMouseOver}
                            onMouseOut={this.handleMouseOut}>
            <Col xs={3} sm={3} md={condensed? 2:3}
                 onClick={this.props.whenClicked.bind(null, appId, appName, loginLink, registerLink, logoURL, selectedCategoryNames)}
                 style={{height:"100%", textAlign:"center"}}>
                <span className="helper"></span><img className="vertial-middle " src={logoURL}
                                                     style={{width:condensed ? "25px": "50px", top:"18px"}}/>
            </Col>

            <Col xs={5} sm={4} md={condensed? 5:4}
                 className="vertical-center">
                {appName}
            </Col>

            <Col xs={4} sm={3} md={condensed? 5:3} className="vertical-center">
                {toggleButton}
            </Col>

            <Col xs={0} sm={2} md={2} xsHidden
                 style={{display:condensed?"none":"block",color:ZenColor.grey3}}
                 className="vertical-center">
                {subsCount+messages.cata_peopleUse}
            </Col>
        </Row>);

        return <div>
            {appItem}
        </div>
    },

    handleAdd(){
        const {logoURL,appName,loginLink,registerLink,appId} = this.props;
        Meteor.call("addPublicApp", appId, appName, logoURL, loginLink, registerLink);
    },

    handleRemove(){
        Meteor.call("removePublicApp", this.props.appId);
    }
});