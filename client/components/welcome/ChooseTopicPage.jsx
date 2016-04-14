/*******************************************************************************
 * Copyright (C) 2016 Octokey Inc.
 *
 * Creator: Chen Li<chen.li@oyaoshi.com>
 * Creation Date: 2016-4-7
 *
 * Choose Topic Page component for users to choose their interested topics
 *******************************************************************************/
const WhiteOverlay = require('./WhiteOverlay.jsx');
const TopicBox = require('./TopicBox.jsx');
const ChoosePageFooter = require('./ChoosePageFooter.jsx');

const TopicModalContainerAdd = require('./TopicModalContainerAdd.jsx');

const {Col, Row, Grid} = ReactBootstrap;

const { Button } = antd;

const styles = {
  titleDiv: {margin: "50px auto 20px auto", textAlign: "center"},
  titleMain: {color: Colors.grey800},
  titleSub: {color: Colors.grey600, fontWeight: "100"},
};

const ChooseTopicPage = React.createClass({
  propTypes:{
    onClosePage: React.PropTypes.func.isRequired,
  },

  mixins: [ReactMeteorData],

  getMeteorData() {
    const subHandles = Meteor.userId() ?
        [Meteor.subscribe("topics"),] : [];

    const subsReady = _.every(subHandles, function (handle) {
      return handle.ready();
    });

    const currentUserId = Meteor.userId();
    return {
      subsReady: subsReady,
      currentUserId: currentUserId,
      topics: currentUserId ? Topics.find({}, {sort: {topicRank: 1}}).fetch() : null,
    };
  },

  getInitialState(){
    return {
      modalOpen: false,
      selectedTopics:[],
    }
  },

  render(){
    const topicBoxes = this.data.topics.map((topic)=> {
      const checked = _.findIndex(this.state.selectedTopics, (selectedTopic)=>{
            return selectedTopic.topicId===topic._id;
          }) > -1;

      //const iconURL = OctoClientAPI.getTopicIconUrl(topic._id);
      return <TopicBox key={topic._id}
                       topicId={topic._id}
                       iconURL={OctoClientAPI.getTopicIconUrl(topic._id)}
                       topicName={topic.topicName}
                       topicRank={topic.topicRank}
                       followCount={topic.followCount}
                       checked = {checked}
                       whenTopicClicked={this.handleTopicClicked}/>;
    });

    const title = <div style={styles.titleDiv}>
      <h1 style={styles.titleMain}>你想关注的兴趣</h1>
      <h2 style={styles.titleSub}>我们将根据你关注的兴趣定制你的应用推荐</h2>
    </div>;

    const createTopicBtn = OctoClientAPI.isAdmin() ?
        <div>
          <TopicModalContainerAdd
              modalOpen={this.state.modalOpen}
              onModalClose={()=>{this.setState({modalOpen:false});}}
              //allCategories={this.props.allCategories}
          />
          <Button type="primary" style={styles.addTopicBtn}
                  onClick={()=>{this.setState({modalOpen:true})}}>
            {"添加Topic"/*message*/}
          </Button>
        </div>
        : null;

    return (
        <WhiteOverlay visibility={true}>
          <div>
            <Grid>
              {title}

              <Row>
                <Col xs={8} xsOffset={2}>
                  {topicBoxes}
                </Col>
                <Col xs={2}>
                </Col>
              </Row>
              {createTopicBtn}
              <ChoosePageFooter
                  okText = {"选好了" /*message*/}
                  onOkClicked = {this.handleOKBtnClicked/*message*/}
                  onSkipClicked = {()=>{alert("skip button clicked")}}
              />
            </Grid>
          </div>
        </WhiteOverlay>
    )
  },

  // 用户添加or取消topic
  handleTopicClicked(topicId, topicName, topicRank){
    const clickedTopic = {topicId : topicId, topicName : topicName, topicRank : topicRank};
    let selectedTopics = this.state.selectedTopics;

    const topicIndex = _.findIndex(selectedTopics, (selectedTopic)=>{
      return selectedTopic.topicId === clickedTopic.topicId
    });

    if (topicIndex === -1){// Select topic
      selectedTopics.push(clickedTopic);
    } else {// Unselect topic
      selectedTopics.splice(topicIndex, 1);
    }

    this.setState({ selectedTopics: selectedTopics});
  },

  handleOKBtnClicked(){
    console.log("handleOKBtnClicked");
    Meteor.call("followTopics", this.state.selectedTopics, (error)=>{
      if (error){
        console.log("error", error);
      }
      console.log("User successfully followed the topics");
      this.props.onClosePage();
    });
  },
});

module.exports = ChooseTopicPage;

