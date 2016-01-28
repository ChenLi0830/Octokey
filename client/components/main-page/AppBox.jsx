const {
    Col,
    } = ReactBootstrap;

const {
    Paper,
    } = MUI;

const {
    ContentClear,
    ContentRemove,
    ActionSettings,
    } = SvgIcons;


AppBox = React.createClass({

    propTypes: {
        appId: React.PropTypes.string.isRequired,
        logoURL: React.PropTypes.string.isRequired,
        width: React.PropTypes.string.isRequired,
        whenAppTileClicked: React.PropTypes.func.isRequired,
        userEditStatus: React.PropTypes.string.isRequired,
    },

    getInitialState(){
        return {
            hovered: false,
            //open: false,
            boxHeight: "0px",
        }
    },

    componentDidMount(){
        var boxSize = ReactDOM.findDOMNode(this.refs.appBox).offsetWidth;
        this.setState({//这里会trigger DOM re-render
            height: boxSize
        });
        //console.log("appBox width",ReactDOM.findDOMNode(this.refs.appBox).offsetWidth);
    },

    handleMouseEnter(){
        this.setState({
            hovered: true
        })
    },

    handleMouseLeave(){
        this.setState({
            hovered: false
        })
    },

    render() {

        var tileStyle = this.getTileStyle(this.props.userEditStatus);
        var image = this.getTileImage(this.props.userEditStatus);

        return <div>
            <Col xlg={1} md={2} sm={3} xs={6} style={{padding:"0"}}>
                <Paper rounded={false}
                       ref="appBox"
                       style={tileStyle}
                       onMouseEnter={this.handleMouseEnter}
                       onMouseLeave={this.handleMouseLeave}
                       zDepth={this.state.hovered?1:0}
                       onTouchTap={()=>{this.props.whenAppTileClicked(this.props.appId)}}>
                    {image}
                </Paper>
            </Col>
        </div>
    },

    getTileStyle(userEditStatus){
        let baseStyle = {
            margin: 0,
            borderRadius: "5px",
            width: this.props.width,
            height: this.state.height,
            cursor: "pointer"
        };

        switch (userEditStatus) {
            case "default" :
                baseStyle.backgroundColor = this.state.hovered ? "#FAFAFA" : "rgba(255, 255, 255, 0.0)";
                return baseStyle;
                break;
            case "remove" :
                baseStyle.backgroundColor = this.state.hovered ? ZenColor.orange : "rgba(255, 255, 255, 0.0)";
                return baseStyle;
                break;
            case "config" :
                baseStyle.backgroundColor = this.state.hovered ? ZenColor.cyan : "rgba(255, 255, 255, 0.0)";
                return baseStyle;
                break;
        }
    },

    getTileImage(userEditStatus){
        let image = <img src={this.props.logoURL}
                         style={{width:"100px"}}
                         className="vertical-center horizontal-center"/>;

        switch (userEditStatus) {
            case "default":
                return image;
                break;
            case "remove":
                return this.state.hovered ?
                    <ContentClear className="vertical-center horizontal-center"
                                  style={{height:"60px", width:"60px", fill:ZenColor.white}}/> : image;
                break;
            case "config":
                return this.state.hovered ?
                    <ActionSettings className="vertical-center horizontal-center"
                                    style={{height:"60px", width:"60px", fill:ZenColor.white}}/> : image;
                break;
        }
    }
});