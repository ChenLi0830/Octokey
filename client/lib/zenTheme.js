/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-12-31
 *
 * It defines the theme object used by the app in Material UI
 *******************************************************************************/
ZenRawTheme = {
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: "#12C5A2",
    //primary1Color: "#03A9F4",
    //primary2Color: Colors.pinkA700,
    primary2Color: "#FF6F00",
    primary3Color: Colors.blueGrey400,
    primary4Color: Colors.white,
    accent1Color: "#EB008B",
    accent2Color: Colors.grey100,
    accent3Color: Colors.grey500,
    textColor: Colors.darkBlack,
    alternateTextColor: "rgba(255,255,255,1)",
    //alternateTextColor: Colors.grey700,
    canvasColor: Colors.grey100,
    borderColor: Colors.grey300,
    disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3),
    pickerHeaderColor: Colors.cyan500,
  },
};

ZenColor = {
  pink: Colors.pink500,
  orange: "#F15E0C",
  cyan: "#12C5A2",
  white: "#FFFFFF",
  blue: "#03A9F4",
  grey1: "#fafafa",
  grey1_5: "#f7f7f7",
  grey2: "#f3f3f3",
  grey3: Colors.grey500,
  blueGrey: "#607D8B",
};

customizeMUITheme = function (muiTheme) {

  muiTheme.floatingActionButton.buttonSize = 56;
  muiTheme.floatingActionButton.miniSize = 40;
  muiTheme.tabs.textColor = Colors.grey400;
  //muiTheme.tabs.selectedTextColor = "#F15E0C";
  muiTheme.tabs.selectedTextColor = Colors.blue500;
  muiTheme.ripple.color = Colors.blue300;

  return muiTheme;
}