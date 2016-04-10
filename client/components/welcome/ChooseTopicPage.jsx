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
};

const ChooseTopicPage = React.createClass({
  getInitialState(){
    return {
      modalOpen: false,
    }
  },

  render(){
    const title = <div style={styles.titleDiv}>
      <h1 style={styles.titleMain}>你想关注的兴趣</h1>
      <h2 style={styles.titleSub}>我们将根据你关注的兴趣定制你的应用推荐</h2>
    </div>;

    const createTopicBtn = OctoAPI.isAdmin() ?
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
          <Grid>
            {title}
            <ActionCheckCircle style={{/*fill:Colors.grey400, */fill:ZenColor.cyan}}/>
            <Col xs={8} xsOffset={2}>
              <TopicBox/>
            </Col>

            <Col xs={12}>
              {createTopicBtn}
            </Col>
          </Grid>
        </WhiteOverlay>
    )
  },
});

module.exports = ChooseTopicPage;

