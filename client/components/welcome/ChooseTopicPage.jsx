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
const TopicModalContainerAdd = require('./TopicModalContainerAdd.jsx');

const {Col, Row, Grid} = ReactBootstrap;
const {ActionCheckCircle} = SvgIcons;

const { Button } = antd;

const styles = {
  addTopicBtn: {margin: "auto", display: "block"},
  titleDiv: {margin: "50px auto 20px auto", textAlign: "center"},
  titleMain: {color: Colors.grey800},
  titleSub: {color: Colors.grey600, fontWeight: "100"},
  footer:{position:"fixed", width:"100%", left:0, bottom:0, height: "100px",
    backgroundColor: "rgba(255, 255, 255, 0.9)"},
};

const ChooseTopicPage = React.createClass({
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
      topics: currentUserId ? Topics.find({}, {sort: {rank: -1}}).fetch() : null,
    };
  },

  getInitialState(){
    return {
      modalOpen: false,
    }
  },

  render(){

    const topicBoxes = this.data.topics.map((topic)=> {
      //const iconURL = OctoClientAPI.getTopicIconUrl(topic._id);
      return <TopicBox key={topic._id}
                       topicId={topic._id}
                       iconURL={OctoClientAPI.getTopicIconUrl(topic._id)}
                       topicName={topic.topicName}
                       topicRank={topic.topicRank}
                       followCount={topic.followCount}
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
              <ActionCheckCircle style={{/*fill:Colors.grey400, */fill:ZenColor.cyan}}/>
              <Col xs={8} xsOffset={2} style={{position:"absolute"}}>
                {topicBoxes}
              </Col>
              <div style={styles.footer}>
                <Col xs={12}>
                  {createTopicBtn}
                </Col>
              </div>
            </Grid>
          </div>
        </WhiteOverlay>
    )
  },

  handleTopicClicked(){
    console.log("topic clicked");
  },
});

module.exports = ChooseTopicPage;

