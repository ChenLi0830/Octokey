/*******************************************************************************
 * Copyright (C) 2016 Octokey Inc.
 *
 * Creator: Chen Li<chen.li@oyaoshi.com>
 * Creation Date: 2016-4-7
 *
 * Topic Box component for a single topic
 *******************************************************************************/

const styles = {
  icon: {/*maxHeight: "120px", maxWidth: "120px", */
    height: "100%", width: "100%", borderRadius: "10px"},
  topicName: {fontWeight: 200, /*textShadow: "0px 0px 30px #333"*/}
};

const {Col, Row, Grid} = ReactBootstrap;

const TopicBox = React.createClass({
  propTypes: {
    topicId: React.PropTypes.string.isRequired,
    iconURL: React.PropTypes.string.isRequired,
    topicName: React.PropTypes.string.isRequired,
    topicRank: React.PropTypes.number.isRequired,
    followCount: React.PropTypes.number.isRequired,
  },

  render(){
    return <Col xs={2}>
      {<div>
        <div>
          <img src={this.props.iconURL} style={styles.icon}/>
        </div>
        {/*<div style={{margin:"-30px 0 0 10px", color:"white"}}>*/}
        <div style={{textAlign:"center"}}>
          <h2 style={styles.topicName}>{this.props.topicName}</h2>
          {
            /*<TopicName/>
             <SubscriptionNumber/>
             <Add/>*/
          }
        </div>
        <div id="mask">

        </div>
      </div>}
    </Col>
  },
});

module.exports = TopicBox;

