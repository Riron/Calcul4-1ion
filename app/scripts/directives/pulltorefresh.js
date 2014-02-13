'use strict';

angular.module('calculationApp')
  .directive('pullToRefresh', function ($compile, $timeout, $q) {
    var pullToRefreshConfig = {
			treshold: 60,
			debounce: 400,
			text: {
			  pull: 'Pull to refresh',
			  release: 'Release to refresh',
			  loading: 'Refreshing...'
			},
			icon: {
			  pull: 'arrow_down',
			  release: 'arrow_up',
			  loading: 'icon_loading fa-spin'
			}
		};

    return {
      scope: true,
      restrict: 'A',
      transclude: true,
      template: '<div class="pull-to-refresh"><span ng-class="icon[status]"></span>&nbsp;<span ng-bind="text[status]"></span></div><div ng-transclude></div>',
      compile: function compile() {

        return function postLink(scope, iElement, iAttrs) {

          var config = angular.extend({}, pullToRefreshConfig, iAttrs);
          var scrollElement = iElement.parent();
          var ptrElement = window.ptr = iElement.children()[0];

          // Initialize isolated scope vars
          scope.text = config.text;
          scope.icon = config.icon;
          scope.status = 'pull';

          var setStatus = function(status) {
            shouldReload = status === 'release';
            scope.$apply(function() {
              scope.status = status;
            });
          };

          var shouldReload = false;
          iElement.bind('touchmove', function() {
            var top = scrollElement[0].scrollTop;
            if(top < -config.treshold && !shouldReload) {
              setStatus('release');
            } else if(top > -config.treshold && shouldReload) {
              setStatus('pull');
            }
          });

          iElement.bind('touchend', function() {
            if(!shouldReload) {
							return;
            }
            ptrElement.style.webkitTransitionDuration = 0;
            ptrElement.style.margin = '0 auto';
            setStatus('loading');

            var start = +new Date();
            $q.when(scope.$eval(iAttrs.pullToRefresh))
            .then(function() {
              var elapsed = +new Date() - start;
              $timeout(function() {
                ptrElement.style.margin = '';
                ptrElement.style.webkitTransitionDuration = '';
                scope.status = 'pull';
              }, elapsed < config.debounce ? config.debounce - elapsed : 0);
            });
          });

          scope.$on('$destroy', function() {
            iElement.unbind('touchmove');
            iElement.unbind('touchend');
          });

        };
      }
    };
  });
