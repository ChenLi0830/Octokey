/*******************************************************************************
 * Copyright (C) 2016 Octokey Inc.
 *
 * Creator: Chen Li<chen.li@oyaoshi.com>
 * Creation Date: 2016-4-7
 *
 * Topic Box component for a single topic
 *******************************************************************************/

const styles = {
  icon: {height: "100%", width: "100%", borderRadius: "10px", transitionDuration:"0.5s"},
  topicNameBox: {bottom: 33, left: 38, color: Colors.white, position: "absolute"},
  topicName: {fontWeight: 200, fontSize: 16, /*textShadow: "0px 0px 30px #333"*/},
  imgBox: {/*margin: 10*/margin: 0},
  circleCheck: {height: 25, top: "2.5em", right: "2.9em", position: "absolute"},
};

const {Col, Row, Grid} = ReactBootstrap;

let boxSize;
const TopicBox = React.createClass({
  propTypes: {
    topicId: React.PropTypes.string.isRequired,
    iconURL: React.PropTypes.string.isRequired,
    topicName: React.PropTypes.string.isRequired,
    topicRank: React.PropTypes.number.isRequired,
    followCount: React.PropTypes.number.isRequired,
    checked: React.PropTypes.bool.isRequired,
    whenTopicClicked: React.PropTypes.func.isRequired,
  },

  getInitialState(){
    return {
      focused: false,
      height: "0px",
      loaded: false,
    }
  },

  componentDidMount(){
    boxSize = ReactDOM.findDOMNode(this.refs.boxCol).offsetWidth;
    this.setState({height:boxSize+'px'});
  },

  render(){
    const {topicId, topicName, topicRank} = this.props;
    return <Col xs={3} style={{padding:15}}>
      {<div style={{cursor:"pointer"}}
            ref="boxCol"
            onClick={this.props.whenTopicClicked.bind(null, topicId, topicName, topicRank)}
            onMouseOver={()=>{this.setState({focused:true})}}
            onMouseOut={()=>{this.setState({focused:false})}}>

        <div style={_.extend({},styles.imgBox,{height:this.state.height, width:"100%", backgroundColor: "gainsboro", borderRadius:"10px"})}>
          <img src={/*"http://deelay.me/1000/localhost:3000/"+*/this.props.iconURL}
               style={_.extend({},styles.icon,{opacity:this.state.loaded?(this.state.focused? 0.85:1):0})}
               onLoad = {()=>{this.setState({loaded:true})}}
          />
        </div>

        <div style={styles.topicNameBox}>
          <h2 style={styles.topicName}>{this.props.topicName}</h2>
        </div>

        <img src={this.props.checked? "img/circleCheck.png":"img/circleUncheck.png"}
             style={styles.circleCheck}/>

      </div>}
    </Col>
  },

  handleClick(){
    this.setState({checked: !this.props.checked});
    //alert("clicked")
  },
});

module.exports = TopicBox;

