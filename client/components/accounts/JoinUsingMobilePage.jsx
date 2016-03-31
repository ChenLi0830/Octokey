/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-2-2
 *
 * Sign-up page component, called by "routes"
 *******************************************************************************/
var JoinStep1 = require('./JoinStep1.jsx');
var JoinStep2 = require('./JoinStep2.jsx');
var JoinStep3 = require('./JoinStep3.jsx');

const {
    Paper,
    } = MUI;

const {
    Col,
    } = ReactBootstrap;

import {
    Steps,
} from 'antd';

const Step = Steps.Step;

const styles = {
  paper: {
    paddingTop: 50,
    paddingBottom: 50,
    backgroundColor: ZenColor.grey1,
  },

  paperCol: {
    float: "none",
  },
};

var JoinUsingMobilePage = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired,
    intl: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      step: 0,
      finalCaptcha: "",
      finalPwd: "",
      finalUserName: "",
      registerUsingEmail: false,
    };
  },

  render() {
    messages = _.extend({}, this.context.intl.messages.join, this.context.intl.messages.signIn);
    let contentOfStep = this.getContentForEachStep();

    const steps = [{
      title: messages["stepUsername-设置用户名"],
      //description: '这里是多信息的描述啊'
    }, {
      title: messages["stepAccountInfo-填写帐号信息"],
      //description: '这里是多信息的耶哦耶哦哦耶哦耶'
    }, {
      title: messages["stepSuccessful-注册成功"],
      //description: '描述啊描述啊'
    }].map((s, i) => <Step key={i} title={s.title} description={s.description}/>);

    return (<div>
          <Col style={{backgroundColor:ZenColor.grey1}}>
            <Paper style={styles.paper} zDepth={0}>
              <Col sm={8} smOffset={2} md={8} mdOffset={2} xs={12} style={styles.paperCol}>
                <div style={{textAlign:"left"}}>
                  <Steps current={this.state.step} className="antdsteps">{steps}</Steps>
                  {this.state.step === 0 && contentOfStep[0]}
                  {this.state.step === 1 && contentOfStep[1]}
                  {this.state.step === 2 && contentOfStep[2]}
                </div>
              </Col>
            </Paper>
          </Col>
        </div>
    );
  },

  getContentForEachStep(){
    let contentOfStep = [];
    contentOfStep[0] = <JoinStep1 onStepComplete={this.onStep1Complete}/>;

    contentOfStep[1] = <JoinStep2 finalUserName={this.state.finalUserName}
                                  finalCaptcha={this.state.finalCaptcha}
                                  registerUsingEmail={this.state.registerUsingEmail}
                                  onStepComplete={this.onStep2Complete}/>;

    contentOfStep[2] = <JoinStep3 onStepComplete={this.onStep3Complete}
                                  registerUsingEmail={this.state.registerUsingEmail}/>;
    return contentOfStep;
  },

  onStep1Complete(newState){
    this.setState({
      step: 1,
      finalCaptcha: newState.isUsingEmail ? "" : newState.finalCaptcha,
      finalUserName: newState.isUsingEmail ? newState.finalEmail : newState.finalMobile,
      registerUsingEmail: newState.isUsingEmail,
    })
  },

  onStep2Complete(finalPwd){
    this.setState({
      step: 2,
      finalPwd: finalPwd,
    });
  },

  onStep3Complete(){
    if (this.state.registerUsingEmail) {
      Meteor.loginWithPassword(this.state.finalUserName, this.state.finalPwd, ()=>{
        this.context.router.push('/list');
      });
    } else {
      Meteor.loginWithPhoneAndPassword(this.state.finalUserName, this.state.finalPwd, ()=> {
        this.context.router.push('/list');
      });
    }
  },
});

module.exports = JoinUsingMobilePage;