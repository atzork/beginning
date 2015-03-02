/**
 * Created by sergey on 2/26/15.
 */

var oz = oz || {};

oz
  .service('Auth', [
    '$resource', '$state', '$window', 'userManager', 'Session',
    function($resource, $state, $window, userManager, Session) {
      this.authProxy = $resource('/api/user', null, {
        logIn: {method: 'POST', url: '/api/user/login'},
        logOut: {method: 'POST', url: '/api/user/logout'}
      });

      this.getToken = function() {
        return $window.localStorage.getItem('token');
      };

      this.setToken = function(token) {
        $window.localStorage.setItem('token', token);
        return this;
      };

      this.deleteToken = function() {
        $window.localStorage.removeItem('token');
        return this;
      };

      this.logIn = function(userData, done) {
        var self = this;
        return this.authProxy.logIn(null, userData,
          function(resp) {
            if (resp.error || !resp.data || !resp.data.user) {
              console.error('User Login Error!!');
              done(resp.error);
            } else {
              if (resp.data.token) {
                this.setToken(resp.data.token);
              }
              userManager.setUserLocal(resp.data.user);
              Session.create(resp.data.user._id, resp.data.user.role);
              done(resp.error, resp.data, resp);
            }
            return self;
          },
          function() {
            console.log('Ajax ERROR!!!', arguments);
          }
        );
      };

      this.logOut = function(done) {
        var self = this;
        return this.authProxy.logOut(function(resp) {
          if (resp.error || !resp.data || !resp.data.user) {
            console.error('LogOut Error!!');
            done(resp.error);
          } else {
            this.deleteToken();
            userManager.deleteUserLocal(Session.userID);
            Session.destroy();
            done(resp.error, resp.data, resp);
            $state.go('app.login');
          }
          return self;
        });
      };

      this.isAuthenticated = function(done) {
        if (!Session.userID) {
          userManager.getUser(null, function (error, user) {
            if (error || !user) {
              return done(error);
            }
            Session.create(user._id, user.role);
            return done(null, Session);
          });
        } else {
          return done(null, Session);
        }
      };

      this.isAuthorized = function(authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) {
          authorizedRoles = [authorizedRoles];
        }
        return (Session.userRole && (authorizedRoles.indexOf(Session.userRole) !== -1));
      };
    }
  ])
  .service('Session', function() {
    this.create = function(userID, userRole) {
      this.userID = userID;
      this.userRole = userRole;
    };

    this.destroy = function() {
      this.userID = null;
      this.userRole = null;
    };
    return this;
  });
