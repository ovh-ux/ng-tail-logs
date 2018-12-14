import angular from 'angular';
import 'angularjs-scroll-glue';

import ngTailLogsComponent from './ng-tail-logs.component';
import ngTailLogService from './ng-tail-logs.service';

import './ng-tail-logs.less';

const moduleName = 'ngTailLogs';

angular
  .module(moduleName, [
    'luegg.directives',
  ])
  .component('ovhTailLogs', ngTailLogsComponent)
  .service('OvhTailLogs', ngTailLogService);

export default moduleName;
