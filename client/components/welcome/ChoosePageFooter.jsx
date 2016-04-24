/*******************************************************************************
 * Copyright (C) 2016 Octokey Inc.
 *
 * Creator: Chen Li<chen.li@oyaoshi.com>
 * Creation Date: 2016-4-14
 *
 * The footer of choose-something-page
 *******************************************************************************/
import { Button} from 'antd';
const {Col, Row, Grid} = ReactBootstrap;

const styles = {
  footer: {
    position: "fixed", width: "100%", left: 0, bottom: 0, height: "100px", zIndex: 501,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  col: {lineHeight: "100px", textAlign: "center"},
  okBtn: {marginLeft: "50px", fontWeight: 200},
  skipBtn: {marginLeft: "20px", fontWeight: 200},
};

const ChoosePageFooter = React.createClass({
  propTypes: {
    okText: React.PropTypes.string.isRequired,
    onOkClicked: React.PropTypes.func.isRequired,
    skipText: React.PropTypes.string.isRequired,
    onSkipClicked: React.PropTypes.func.isRequired,
  },

  getDefaultProps() {
    return {
      okText: "选好了",
      skipText: "跳过",
    }
  },

  render(){
    return <div style={styles.footer}>
      <Col xs={12} style={styles.col}>
        {<Button type="primary" style={styles.okBtn}
                 size="large"
                 onClick={this.props.onOkClicked}>
          {this.props.okText}
        </Button>}

        <Button type="dashed" style={styles.skipBtn}
                onClick={this.props.onSkipClicked}>
          {this.props.skipText}
        </Button>

        {/*createTopicBtn*/}
      </Col>
    </div>
  },
});

module.exports = ChoosePageFooter;

