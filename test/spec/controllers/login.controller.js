'use strict';

describe('Controller: LoginController', function () {

  // load the controller's module
  beforeEach(module('findAWake'));

  var controller;
  var scope;
  var simpleLogin = {
    login: jasmine.createSpy('SimpleLogin.login'),
    assertValidLoginAttempt: jasmine.createSpy('SimpleLogin.login')
  };
  var location = {
    path: jasmine.createSpy('$location.path'),
    redirect: jasmine.createSpy('$location.redirect')
  };

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$controller_, _$rootScope_) {
    var $controller = _$controller_;
    var $rootScope = _$rootScope_;
    scope = $rootScope.$new();

    controller = $controller('LoginController', {
      $scope: scope,
      SimpleLogin: simpleLogin,
      $location: location,
    });
  }));

  it('should be defined', function () {
    expect(controller).toBeDefined();
  });


});
