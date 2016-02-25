/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-31
 *
 * Floating Action Button component in Apps container, called by "AppsContainer"
 *******************************************************************************/
const {
    FloatingActionButton,
    Tooltip,
    } = MUI;

const {
    ToggleStar,
    ActionList,
    ContentCreate,
    ContentAdd,
    ContentRemove,
    ActionSettings,
    AvFiberNew,
    } = SvgIcons;

FloatingEditButton = React.createClass({

    propTypes: {
        whenEditButtonClicked: React.PropTypes.func.isRequired,
        userEditStatus: React.PropTypes.string.isRequired,
    },

    contextTypes: {
        intl: React.PropTypes.object.isRequired,
    },

    getInitialState(){
        return {
            FABActive: false,
            hoveredTooltip: -1,
        }
    },

    render(){
        const {messages} = this.context.intl;

        let miniButtonIconElements = [/*<ContentCreate/>, */<ContentAdd/>, <ContentRemove/>, <ContentCreate/>,
            <AvFiberNew/>];
        let miniIconColor = [
            {background: ZenColor.cyan, icon: ZenColor.white},
            {background: ZenColor.orange, icon: ZenColor.white},
            {background: ZenColor.blueGrey, icon: ZenColor.white},
            {background: ZenColor.cyan, icon: ZenColor.white}
        ];
        const toolTips = [messages.tooltip_add, messages.tooltip_delete,
            messages.tooltip_setting, messages.tooltip_register];


        let buttonList = miniButtonIconElements.map(function (iconElement, i) {
            let basicLiStyle = this.state.FABActive ?
            {
                transform: "scaleY(1) scaleX(1) translateY(0px) translateX(0px)",
                opacity: 1,
                transitionDuration: "0.3s",
                visibility: "visible"
            }
                : {
                transform: "scaleY(0.4) scaleX(0.4) translateY(40px) translateX(0px)",
                opacity: 0,
                transitionDuration: "0.2s",
                visibility: "hidden"
            };
            basicLiStyle.transitionDelay = (miniButtonIconElements.length - i) * 0.05 + "s";
            return <li style={basicLiStyle} key={i}>
                <FloatingActionButton
                    secondary={true} mini={true}
                    backgroundColor={miniIconColor[i].background}
                    iconStyle={{fill:miniIconColor[i].icon}}
                    onTouchTap={this.handleFABClick.bind(null,i)}
                    children={iconElement}
                    onMouseEnter={this.handleTooltipOpen.bind(this,i)}
                    onMouseLeave={this.handleTooltipClose}
                />
                <Tooltip show={this.state.hoveredTooltip===i}
                         label={toolTips[i]}
                         style={{right: 62, top:16}}
                         horizontalPosition="left"
                         verticalPosition="top"
                         touch={true}
                />
            </li>
        }.bind(this));

        const FAB = this.getFAB(this.props.userEditStatus, buttonList);

        return FAB;
    },

    getFAB(userEditStatus, buttonList){
        switch (userEditStatus) {
            case "default":
                return (
                    <div className="fixed-floating-btn" onMouseLeave={this.handleLeaveFAB}>
                        <ul className="list-unstyled ">
                            {buttonList}
                        </ul>
                        <FloatingActionButton
                            backgroundColor={ZenColor.cyan}
                            iconStyle={{fill:ZenColor.white}}
                            onMouseEnter={this.handleHoverFAB}>
                            <ActionSettings style={{width:"28px"}}/>
                        </FloatingActionButton>
                    </div>
                );
                break;
            default :
                return (
                    <div className="fixed-floating-btn">
                        <FloatingActionButton
                            backgroundColor={ZenColor.orange}
                            style={{color:ZenColor.white}}
                            onTouchTap={this.props.whenEditButtonClicked}>
                            <p>{this.context.intl.messages.FAB_cancel}</p>
                        </FloatingActionButton>
                    </div>
                );
                break;
        }
    },

    handleHoverFAB(){
        this.setState({FABActive: true});
    },

    handleLeaveFAB(){
        this.setState({FABActive: false});
    },

    handleFABClick(i){
        clearTimeout(this.tooltipTimer);
        this.setState({hoveredTooltip: -1});
        this.props.whenEditButtonClicked(i);
    },

    handleTooltipOpen(i){
        this.tooltipTimer = setTimeout(()=> {
            this.setState({hoveredTooltip: i});
        }, 100)
    },

    handleTooltipClose(){
        clearTimeout(this.tooltipTimer);
        this.setState({hoveredTooltip: -1});
    }
});