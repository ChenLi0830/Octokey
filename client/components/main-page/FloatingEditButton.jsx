const {
    FloatingActionButton,
    } = MUI;

const {
    ToggleStar,
    ActionList,
    ContentCreate,
    ContentAdd,
    ContentRemove,
    ActionSettings,
    } = SvgIcons;

FloatingEditButton = React.createClass({

    getInitialState(){
        return {
            FABActive: false,
        }
    },

    render(){
        let miniButtonIconElements = [/*<ContentCreate/>, */<ContentAdd/>, <ContentRemove/>, <ActionSettings/>];
        let miniIconColor = [
            {background: ZenColor.cyan, icon: ZenColor.white},
            {background: ZenColor.orange, icon: ZenColor.white},
            {background: ZenColor.blueGrey, icon: ZenColor.white},
            {background: ZenColor.cyan, icon: ZenColor.white}
        ];

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
                    onTouchTap={this.handleTouchButton.bind(this,i)}>
                    {iconElement}
                </FloatingActionButton>
            </li>
        }.bind(this));

        return <div className="fixed-floating-btn" onMouseLeave={this.handleLeaveFAB}>
            <ul style={{}} className="list-unstyled ">
                {buttonList}
            </ul>
            <FloatingActionButton
                backgroundColor={ZenColor.cyan}
                iconStyle={{fill:ZenColor.white}}
                onMouseEnter={this.handleHoverFAB}>
                <ContentCreate style={{width:"28px"}}/>
            </FloatingActionButton>
        </div>
    },

    handleHoverFAB(){
        this.setState({FABActive: true});
    },

    handleLeaveFAB(){
        this.setState({FABActive: false});
    },

    handleTouchButton(i){
        alert("button" + i + "is clicked");
        handleLeaveFAB();
    }
});