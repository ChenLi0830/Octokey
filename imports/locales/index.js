/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-12-31
 *
 * It controls where the language files are read. It declares the languages
 * object used by "IntlWrapper".
 *******************************************************************************/
var enUs = require("./en-US.json");
var zhCn = require("./zh-CN.json");
var languages = [];

languages["zh-CN"] = zhCn;
languages["zh"] = zhCn;
languages["en-US"] = enUs;

export default languages;