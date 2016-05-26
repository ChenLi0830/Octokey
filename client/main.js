import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { renderRoutes } from '../imports/startup/client/routes.jsx';

import "../imports/startup/client/startUp";
import "../imports/startup/client/ReactIntl";
import "../imports/startup/client/clientAccessibleMethods";

Meteor.startup(() => {
  render(renderRoutes, document.getElementById("app-container"));
});
