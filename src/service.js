import angular from 'angular';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import uniq from 'lodash/uniq';

export default /* @ngInject */ ($q, $timeout, $http) => class {
  constructor(opts) {
    this.funcSource = opts.source || angular.noop;

    this.logs = [];
    this.delay = opts.delay || 5000;

    this.source = this.getFuncSource();
  }

  getFuncSource() {
    return $q.when(this.funcSource());
  }

  log() {
    return this.source
      .then(source => $http.get(`${source}&sort=asc&limit=500`))
      .then((response) => {
        this.logs = uniq(
          flatten([...this.logs, get(response, 'data.messages', [])]),
          log => log.message._id, // eslint-disable-line no-underscore-dangle
        );
        return this.logs;
      })
      .catch(({ status }) => {
        if (status === 410) {
          return this.source
            .then(() => this.log());
        }
        return undefined;
      })
      .finally(() => {
        this.timer = $timeout(() => {
          this.log();
        }, this.delay);
        return this.logs;
      });
  }

  stop() {
    if (this.timer) {
      $timeout.cancel(this.timer);
    }
    return $q.when(this);
  }
};
