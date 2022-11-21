import IncidentComponent from './incident.component';

import IncidentRoutes from './incident.route';

/* global angular */

export default angular.module('tinyhands.Incident', [])
    .config(IncidentRoutes)
    .component('incidentComponent', IncidentComponent)
    .name;