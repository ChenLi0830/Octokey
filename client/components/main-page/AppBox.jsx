const {
    Col,
    } = ReactBootstrap;

const {
    Paper,
    } = MUI;

AppBox = React.createClass({

    propTypes: {
        appId: React.PropTypes.string.isRequired,
        logoURL: React.PropTypes.string.isRequired,
        width: React.PropTypes.string.isRequired,
        whenAppTileClicked: React.PropTypes.func.isRequired,
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

    render() {
        const appBoxButton = (<Col xlg={1} md={2} sm={3} xs={6} style={{padding:"0"}}>
            <Paper rounded={false}
                   ref="appBox"
                   style={{
               backgroundColor:this.state.hovered?"#FAFAFA":"rgba(255, 255, 255, 0.0)",
               margin:0,
               borderRadius:"5px",
               width:this.props.width,
               height:this.state.height,
               cursor: "pointer"}}
                   onMouseOver={this.handleMouseOver}
                   onMouseOut={this.handleMouseOut} zDepth={this.state.hovered?1:0}
                   onTouchTap={()=>{this.props.whenAppTileClicked(this.props.appId)}}>
                <img src={this.props.logoURL} style={{width:"100px"}} className="vertical-center horizontal-center"/>
            </Paper>
        </Col>);

        return <div>
            {appBoxButton}
        </div>
    }
});