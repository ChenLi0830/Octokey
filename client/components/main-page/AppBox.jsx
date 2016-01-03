const {
  Col,
  Thumbnail,
  } = ReactBootstrap;

const {
  Paper
  } = MUI;

AppBox = React.createClass({

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
    return <Col md={2} style={{padding:"0"}}>
      <Paper rounded={false}
             style={{backgroundColor:this.state.hovered?"#FAFAFA":"rgba(255, 255," +
       " 255, 0.0)", margin:0, borderRadius:"5px", width:this.props.width, height:this.props.width}}
             onMouseOver={this.handleMouseOver}
             onMouseOut={this.handleMouseOut} zDepth={this.state.hovered?1:0}>
        <img src={this.props.logoURL} style={{width:"100px"}} className="vertical-center horizontal-center"/>
      </Paper>
    </Col>;
    /*return <Col xs={3} md={2}>
     <br/>
     <div className = "app-box" >
     <LogoContainer logoURL={this.props.logoURL} showConfig={this.props.showConfig}/>
     <p>{this.props.appName}</p>
     </div>
     </Col>*/
  }
})
;