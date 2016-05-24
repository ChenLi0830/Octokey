/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-12-31
 *
 * LanguageSelection component. Used to select UI language
 *******************************************************************************/
import Menu from "antd/lib/menu";
import Dropdown from "antd/lib/dropdown";
import Icon from "antd/lib/icon";
const DropdownButton = Dropdown.Button;

const styles = {
  dropDown: {
    position: "fixed",
    display: "block",
    bottom: 0,
  }
};

var Actions =  require("./action-and-stores/Actions.jsx");
LanguageSelection = React.createClass({
  getInitialState(){
    return {
      language: "zh",
    }
  },

  render(){
    const menu = (
        <Menu onClick={this.handleMenuClick}>
          <Menu.Item key="zh">中文</Menu.Item>
          <Menu.Item key="en-US">English</Menu.Item>
        </Menu>
    );

    return (
        <DropdownButton onClick={this.handleButtonClick} overlay={menu} type="primary"
                        style={styles.dropDown}>
          {
            this.state.language === "zh" && "English"
            || this.state.language === "en-US" && "中文"
              //除了使用中文时显示“English”,其他时候都显示“中文”
            || "中文"
          }
        </DropdownButton>
    )
  },

  //Switch language between Chinese and English
  handleButtonClick(){
    if (this.state.language === "zh") {
      this.handleLanguageChange("en-US")
    } else {
      this.handleLanguageChange("zh")
    }
  },

  //handleMenuClick({key}){
  handleMenuClick({key}){
    //console.log("event",event);
    this.handleLanguageChange(key);
  },

  handleLanguageChange(value){
    console.log("language value", value);
    Actions.selectNewLanguage(value);
    this.setState({language: value});
  },
});