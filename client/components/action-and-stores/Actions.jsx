/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-26
 *
 * Actions
 * This is used as the 'actions' of Re-flux
 *******************************************************************************/

//这里不给stores建文件夹是为了保证它在Actions之后运行
//它们被放在action-and-stores里也为了保证它们比其他components先运行
//注意它们不能被放在lib文件夹下,因为这会导致它比client/lib先运行,导致Reflux还没被声明
Actions = Reflux.createActions([
    'selectNewCategory',
    'selectNewLanguage',
    'setPassword',
    'initKeySaltIv',
]);

