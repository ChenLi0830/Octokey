/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-4-8
 *
 * White overlay with transparency used by welcome pages
 *******************************************************************************/ import React from "react"


var WhiteOverlay = React.createClass({
  propTypes: {
    children: React.PropTypes.element,
    openOverlay: React.PropTypes.bool.isRequired,
    // The name of the entrance & exit animations (from animate.css)
    entrance: React.PropTypes.string,
    exit: React.PropTypes.string,
  },

  render (){
    const {openOverlay, entrance, exit} = this.props;
    //console.log("this.props.openOverlay", this.props.openOverlay);
    return (
        <div className={"animated "+ openOverlay? entrance:exit}
             id="whiteOverlay"
             style={{position:"fixed", top:0, left:0,
                        background: this.props.openOverlay ? "rgba(250,250,250,0.95)" : "rgba(250,250,250,0.0)",
                        zIndex: this.props.openOverlay ? "500" : "-1",
                        width:"100%", height:"100%", overflowY:"scroll",
                        }}>
          {this.props.children}
        </div>
    )
  }
});

module.exports = WhiteOverlay;