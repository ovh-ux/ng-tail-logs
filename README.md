# ng-tail-logs

> AngularJS tail logs module.

[![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-tail-logs)](https://npmjs.com/package/@ovh-ux/ng-tail-logs) [![Dependencies](https://badgen.net/david/dep/ovh-ux/ng-tail-logs)](https://npmjs.com/package/@ovh-ux/ng-tail-logs?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/ng-tail-logs)](https://npmjs.com/package/@ovh-ux/ng-tail-logs?activeTab=dependencies) [![Gitter](https://badgen.net/badge/gitter/ovh-ux/blue?icon=gitter)](https://gitter.im/ovh/ux)

Poll a log API for displaying messages

## Install

```sh
yarn add @ovh-ux/ng-tail-logs
```

## Usage

```js
import angular from 'angular';
import '@ovh-ux/ng-tail-logs';

angular
  .module('myApp', ['ngTailLogs'])
  .controller('MyCtrl', /* @ngInject */ ($q, TailLogs) => {
    this.logger = new TailLogs({
      source: () => $q.when('http://my-log-url'),
      delay: 2000,
    });
  });
```

```html
<div data-ng-controller="MyCtrl as $ctrl">
    <tail-logs>
        <div data-ng-repeat="log in $ctrl.logger.logs track by $index"
             data-ng-bind="log.message">
        </div>
    </tail-logs>
</div>
```

## Test

```sh
yarn test
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh-ux/ng-tail-logs/issues/new) or working on some of the [open issues](https://github.com/ovh-ux/ng-tail-logs/issues), our [contributing guide](CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
