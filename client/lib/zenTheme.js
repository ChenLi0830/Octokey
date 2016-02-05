/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-31
 *
 * It defines the theme object used by the app in Material UI
 *******************************************************************************/
ZenRawTheme = {
    spacing: Spacing,
    zIndex: zIndex,
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary1Color: "#12C5A2",
        primary2Color: Colors.pinkA700,
        primary3Color: Colors.blueGrey400,
        accent1Color: "#EB008B",
        accent2Color: Colors.grey100,
        accent3Color: Colors.grey500,
        textColor: Colors.darkBlack,
        alternateTextColor: "rgba(255,255,255,1)",
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
    grey2: "#f3f3f3",
    blueGrey: "#607D8B",
};

customizeMUITheme = function (muiTheme){

    muiTheme.floatingActionButton.buttonSize = 56;
    muiTheme.floatingActionButton.miniSize = 40;

    return muiTheme;
}