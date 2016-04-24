/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-31
 *
 * Component for a single App box, called by "AppsContainer"
 *******************************************************************************/
const {
    Col,
    } = ReactBootstrap;

import { Modal} from 'antd';

const {
    Paper,
    Popover,
    Menu,
    MenuItem,
    } = MUI;

const {
    ContentClear,
    ContentRemove,
    ActionSettings,
    AvFiberNew,
    } = SvgIcons;

const styles = {
  boxBottomBanner: {
    position: "absolute",
    height: 35,
    bottom: 0,
    backgroundColor: "#fafafa",
    textAlign: "center",
    lineHeight: "35px",
    fontSize: "14px",
    color: "#888",
    borderRadius: "0px 0px 5px 5px",
    WebkitAnimationDuration: "0.3s",
  }
};

var AppBox = React.createClass({
  propTypes: {
    appId: React.PropTypes.string.isRequired,
    logoURL: React.PropTypes.string.isRequired,
    usernames: React.PropTypes.array.isRequired,
    appName: React.PropTypes.string.isRequired,
    width: React.PropTypes.string.isRequired,
    whenAppTileClicked: React.PropTypes.func.isRequired,
    userEditStatus: React.PropTypes.string.isRequired,
  },

  getInitialState(){
    return {
      hovered: false,
      //open: false,
      boxHeight: "0px",
      modalOpen: false,
    }
  },

  componentDidMount(){
    var boxSize = ReactDOM.findDOMNode(this.refs.appBox).offsetWidth;
    this.setState({//这里会trigger DOM re-render
      height: boxSize
    });
    //console.log("appBox width",ReactDOM.findDOMNode(this.refs.appBox).offsetWidth);
  },

  render() {
    var tileStyle = this.getTileStyle(this.props.userEditStatus);
    var image = this.getTileImage(this.props.userEditStatus);
    var usernameItems = this.props.usernames.map((username)=> {
      return <MenuItem key={username} primaryText={username} value={username}/>
    });

    //console.log("usernames", this.props.usernames);
    return <div>
      <Col lg={2} md={2} sm={3} xs={4} style={{padding:"0"}}>
        {
          this.props.usernames.length <= 1 ? null : (
              <Modal title={this.props.appName + "-账户选择"}
                     okText="完成"
                     cancelText="取消"
                     visible={this.state.modalOpen}
                     onOk={()=>{this.setState({modalOpen:false})}}
                     onCancel={()=>{this.setState({modalOpen:false})}}
              >
                <Menu zDepth={0} ref="menu"
                      onChange={this.handleAccountTouchTap}
                      width="100%"
                      autoWidth={false}
                      listStyle={{display:"block"}}
                >
                  {usernameItems}
                </Menu>
              </Modal>
          )
        }


        <Paper rounded={false}
               ref="appBox"
               style={tileStyle}
               onMouseEnter={this.handleMouseEnter}
               onMouseLeave={this.handleMouseLeave}
               zDepth={this.state.hovered?1:0}
               onTouchTap={this.handleTouchTap}>
          {image}
          {
            this.state.hovered ?
                <div className="animated fadeIn"
                     style={_.extend({}, styles.boxBottomBanner, {width: this.props.width})}>
                  {this.props.appName}
                </div>
                : null
          }
        </Paper>
      </Col>
    </div>
  },

  handleMouseEnter(){
    this.setState({
      hovered: true
    })
  },

  handleMouseLeave(){
    this.setState({
      hovered: false
    })
  },

  handleTouchTap(event){
    //If trying to login
    if (this.props.userEditStatus === "default") {
      if (this.props.usernames.length === 0) {
        this.props.whenAppTileClicked(this.props.appId)
      }
      else if (this.props.usernames.length === 1) {
        this.props.whenAppTileClicked(this.props.appId, this.props.usernames[0])
      }
      else {//More than 1 username, openPopOver to for user to choose
        this.setState({
          modalOpen: true,
          anchorEl: event.currentTarget,
        });
      }
    } else {//If trying to remove, edit or register
      this.props.whenAppTileClicked(this.props.appId)
    }

  },

  handleAccountTouchTap(event, selectedIndex, menuItem) {
    //console.log("selectedIndex",selectedIndex);
    this.props.whenAppTileClicked(this.props.appId, selectedIndex);
    this.setState({modalOpen: false});
  },

  getTileStyle(userEditStatus){
    let baseStyle = {
      margin: 0,
      borderRadius: "5px",
      width: this.props.width,
      height: this.state.height,
      cursor: "pointer"
    };

    switch (userEditStatus) {
      case "default" :
      case "register" :
        baseStyle.backgroundColor =
            this.state.hovered ? ZenColor.grey1 : "rgba(255, 255, 255, 0.0)";
        return baseStyle;
        break;
      case "remove" :
        baseStyle.backgroundColor =
            this.state.hovered ? ZenColor.orange : "rgba(255, 255, 255, 0.0)";
        return baseStyle;
        break;
      case "config" :
        baseStyle.backgroundColor = this.state.hovered ? ZenColor.cyan : "rgba(255, 255, 255, 0.0)";
        return baseStyle;
        break;
    }
  },

  getTileImage(userEditStatus){
    let image = <img src={this.props.logoURL}
                     style={{width:"100px"}}
                     className="vertical-center horizontal-center"/>;

    switch (userEditStatus) {
      case "default":
        return image;
        break;
      case "register":
        return this.state.hovered ?
            <AvFiberNew className="vertical-center horizontal-center"
                        style={{height:"60px", width:"60px", fill:ZenColor.cyan}}/> : image;
        break;
      case "remove":
        return this.state.hovered ?
            <ContentRemove className="vertical-center horizontal-center"
                           style={{height:"60px", width:"60px", fill:ZenColor.white}}/> : image;
        break;
      case "config":
        return this.state.hovered ?
            <ActionSettings className="vertical-center horizontal-center"
                            style={{height:"60px", width:"60px", fill:ZenColor.white}}/> : image;
        break;
    }
  }
});

module.exports = AppBox;