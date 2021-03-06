'use strict';

angular.module('federicot.ng-message-center', [])
    .factory('ngMessageCenter', ['$rootScope', function ($rootScope) {
        var messages = {};
        var id = 0;
        var service = {
            defaultOptions: {
                name: 'default',
                next: false,
                stack: false,
                timeout: 3000
            },
            error: function (options) {
                options.type = 'alert-danger';
                this.add(options);
            },
            warning: function (options) {
                options.type = 'alert-warning';
                this.add(options);
            },
            success: function (options) {
                options.type = 'alert-success';
                this.add(options);
            },
            info: function (options) {
                options.type = 'alert-info';
                this.add(options);
            },
            add: function (options) {
                id = id + 1;
                var msg;
                msg = angular.extend({}, this.defaultOptions, options);

                if (messages[msg.name] === undefined) {
                    this.get(msg.name);
                }

                if (!msg.stack) {
                    this.clear(msg.name);
                }

                msg.id = id;
                msg.close = function () {
                    service.remove(this);
                };

                if (msg.next) {
                    messages[msg.name].next.push(msg);
                } else {
                    messages[msg.name].current.push(msg);
                }
            },
            remove: function (message) {
                for (var i = 0, len = messages[message.name].current.length; i < len; i++) {
                    if (messages[message.name].current[i].id === message.id) {
                        messages[message.name].current.splice(i, 1);
                        break;
                    }
                }
            },
            clear: function (name) {
                if (name) {
                    messages[name].current.length = 0;
                    return;
                }
                angular.forEach(messages, function (value, key) {
                    messages[key].current.length = 0;
                });
            },
            createSpace: function (name) {
                if (!messages[name]) {
                    messages[name] = {
                        next: [],
                        current: []
                    }
                }
            },
            moveNextToCurrent: function () {
                angular.forEach(messages, function (value, key) {
                    angular.copy(messages[key].next, messages[key].current);
                    messages[key].next.length = 0;
                });
            },
            get: function (name) {
                if (!name) name = 'default';
                this.createSpace(name);
                return messages[name];
            }
        };

        $rootScope.$on('$locationChangeStart', function () {
            service.clear()
        });
        $rootScope.$on('$locationChangeSuccess', function () {
            service.moveNextToCurrent()
        });

        return service;
    }])

    .directive('ngmessagecenterMessages', ['ngMessageCenter', '$compile', function (ngMessageCenter, $compile) {
        var templateStr = '<div class="row">' +
            ' <div class="col-lg-12 " ng-repeat="message in messages.current">' +
            '     <ngmessagecenter-message message="message"></ngmessagecenter-message>' +
            ' </div>' +
            '</div>';
        return {
            restrict: 'E',
            template: templateStr,
            scope: {},
            link: function ($scope, element, attrs) {
                var name = (attrs.name) ? attrs.name : 'default';

                if ($scope.messages === undefined) {
                    $scope.messages = new Object();
                }

                if (attrs.growl !== undefined) {
                    element.addClass('message-center-growl');
                    var bottom = attrs.growl.indexOf("bottom") > -1;
                    var left = attrs.growl.indexOf("left") > -1
                    if (bottom) {
                        element.addClass('bottom');
                    } else {
                        element.addClass('top');
                    }
                    if (left) {
                        element.addClass('left');
                    } else {
                        element.addClass('right');
                    }
                }

                $scope.messages = ngMessageCenter.get(name);
            }
        };
    }])

    .directive('ngmessagecenterMessage', ['$timeout', function ($timeout) {
        var templateStr = '<div class="alert fade in" role="alert" ng-class="message.type">' +
            ' <button type="button" class="close" data-dismiss="alert" ng-click="closeMessage()">' +
            '      <span aria-hidden="true">×</span>' +
            ' </button>' +
            ' <strong ng-if="message.title">{{message.title}} </strong>{{message.text}}' +
            '</div>';
        return {
            restrict: 'E',
            template: templateStr,
            link: function (scope, element, attrs) {
                if (scope.message !== undefined) {
                    scope.closeMessage = function () {
                        scope.message.close();
                    }
                    if (scope.message.timeout) {
                        $timeout(function () {
                            scope.message.close();
                        }, scope.message.timeout);
                    }
                }
            }
        };
    }]);
