'use strict';

angular.module('EventsMod')
  .factory('Events', function ($resource) {
    return $resource('/api/event/:id/', {} ,
      {
        all: {
          url: '/api/event/all/',
          isArray: true,
          method: 'GET'
        },
        get: {
          method: 'GET',
          params: {
            id: '@id'
          }
        },
        create: {
          method: 'POST'
        },
        update: {
          method: 'PUT',
          params: {
            id: '@id'
          }
        },
        destroy: {
          method: 'DELETE',
          params: {
            id: '@id'
          }
        },
        dashboard: {
          url: '/api/event/feed/dashboard',
          method: 'GET',
          isArray: true
        }
      }
    );
  });
