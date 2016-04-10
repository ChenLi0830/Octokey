/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-4-8
 *
 * White overlay with transparency used by welcome pages
 *******************************************************************************/


var WhiteOverlay = React.createClass({
  propTypes: {
    visibility: React.PropTypes.bool.isRequired,
    children: React.PropTypes.element,
  },

  render (){
    //console.log("this.props.visibility", this.props.visibility);
    return <div className="animated fadeIn"
                id="whiteOverlay"
                style={{position:"fixed", top:0, left:0,
                        background: this.props.visibility ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.0)",
                        zIndex: this.props.visibility ? "500" : "-1",
                        width:"100%", height:"100%",
                        }}>
      {this.props.children}
    </div>
  }
});

module.exports = WhiteOverlay;