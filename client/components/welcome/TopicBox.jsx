/*******************************************************************************
 * Copyright (C) 2016 Octokey Inc.
 *
 * Creator: Chen Li<chen.li@oyaoshi.com>
 * Creation Date: 2016-4-7
 *
 * Topic Box component for a single topic
 *******************************************************************************/

const styles = {
  icon: {height: "100%", width: "100%", borderRadius: "10px"},
  topicNameBox: {bottom: 33, left: 38, color: Colors.white, position: "absolute"},
  topicName: {fontWeight: 200, fontSize: 17, /*textShadow: "0px 0px 30px #333"*/},
  imgBox: {margin: 10},
  circleCheck: {height: 25, top: "2.9em", right: "3.2em", position: "absolute"},
};

const {Col, Row, Grid} = ReactBootstrap;

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
      focused:false,
    }
  },

  render(){
    const {topicId, topicName, topicRank} = this.props;
    return <Col xs={3} style={{padding:15}}>
      {<div style={{cursor:"pointer"}}
            onClick={this.props.whenTopicClicked.bind(null, topicId, topicName, topicRank)}
            onMouseOver={()=>{this.setState({focused:true})}}
            onMouseOut={()=>{this.setState({focused:false})}}>

        <div style={styles.imgBox}>
          <img src={this.props.iconURL} style={_.extend({},styles.icon,{opacity:this.state.focused?0.8:1})}/>
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

