/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-2-2
 *
 * Sign-in page component, called by "routes"
 *******************************************************************************/
import React from "react";
import Menu from "antd/lib/menu";
import Icon from "antd/lib/icon";
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import Card from 'antd/lib/card';
import Col from "antd/lib/col";
import Row from "antd/lib/row";

import {FormattedMessage} from "react-intl";

const styles = {};

const Admin = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired,
    intl: React.PropTypes.object.isRequired,
  },

  propTypes: {
    allTopics: React.PropTypes.array.isRequired,
    allPublicApps: React.PropTypes.array.isRequired,
    allCategories: React.PropTypes.array.isRequired,
  },

  getInitialState() {
    return {
      routeValue: ""
    };
  },

  render() {
    //console.log("allTopics", this.props.allTopics);
    //console.log("allPublicApps", this.props.allPublicApps);
    //console.log("allCategories", this.props.allCategories);
    return (
        <Row style={{marginBottom:"100px"}}>
          <Card bordered={false} style={{padding:"20px 0px"}}>
            <Col xs={6}>
              <Menu onClick={this.handleTabChange}
                    style={{ width: 240 }}
                    defaultOpenKeys={['sub1']}
                    selectedKeys={[this.state.routeValue]}
                    mode="inline">
                <SubMenu key="sub1" title={<span><Icon type="mail" /><span>Topics</span></span>}>
                  {/*<MenuItemGroup title="应用排名">*/}
                    <Menu.Item key="overallTop">总排名</Menu.Item>
                    {/*<Menu.Item key="weekTop">本周排名</Menu.Item>*/}
                  {/*</MenuItemGroup>*/}
                  <Menu.Item key="3">改Topic</Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>ZenApps</span></span>}>
                  <Menu.Item key="5">选项5</Menu.Item>
                  <Menu.Item key="6">选项6</Menu.Item>
                  <SubMenu key="sub3" title="三级导航">
                    <Menu.Item key="7">选项7</Menu.Item>
                    <Menu.Item key="8">选项8</Menu.Item>
                  </SubMenu>
                </SubMenu>
                <SubMenu key="sub4" title={<span><Icon type="setting" /><span>ZenCategories</span></span>}>
                  <Menu.Item key="9">选项9</Menu.Item>
                  <Menu.Item key="10">选项10</Menu.Item>
                  <Menu.Item key="11">选项11</Menu.Item>
                  <Menu.Item key="12">选项12</Menu.Item>
                </SubMenu>
              </Menu>
            </Col>

            <Col xs={18}>
              {
                this.props.children && React.cloneElement(this.props.children, {
                  allTopics: this.props.allTopics,
                  allPublicApps: this.props.allPublicApps,
                  allCategories: this.props.allCategories,
                })
              }
            </Col>
          </Card>
        </Row>
    )
  },

  handleTabChange(event){
    const newRoute = "/adminPanel/" + event.key;
    //console.log("newRoute", newRoute);
    this.setState({routeValue: event.key}, function () {
      this.context.router.push(newRoute);
    }.bind(this));
  }

});

module.exports = Admin;