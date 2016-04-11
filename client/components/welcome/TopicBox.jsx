/*******************************************************************************
 * Copyright (C) 2016 Octokey Inc.
 *
 * Creator: Chen Li<chen.li@oyaoshi.com>
 * Creation Date: 2016-4-7
 *
 * Topic Box component for a single topic
 *******************************************************************************/
const {Row} = ReactBootstrap;

const TopicBox = React.createClass({
  propTypes: {
    topicId: React.PropTypes.string.isRequired,
    iconURL: React.PropTypes.string.isRequired,
    topicName: React.PropTypes.string.isRequired,
    topicRank: React.PropTypes.number.isRequired,
    followCount: React.PropTypes.number.isRequired,
  },

  render(){
    return <div>
      {<div>
        <div>
          <img src={this.props.iconURL}/>
        </div>
        <div>
          <p>{this.props.topicName}</p>
          {
            /*<TopicName/>
          <SubscriptionNumber/>
          <Add/>*/
          }
        </div>
      </div>}
    </div>
  },
});

module.exports = TopicBox;

