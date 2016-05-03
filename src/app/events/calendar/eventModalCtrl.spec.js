describe("EventModalCtrl", function() {
    var controller, mockEvent, mockModalInstance = {};

    beforeEach(module('EventsMod'));

    beforeEach(inject(function($rootScope, $controller){
        mockEvent = {title: "Foo"};
        mockModalInstance = jasmine.createSpyObj('mockModalInstance', ['dismiss']);
        var scope = $rootScope.$new();
        controller = $controller('EventModalCtrl', {
            $scope: scope,
            $modalInstance: mockModalInstance,
            event: mockEvent
        });
    }));

    describe("on activate", function() {
        it('should set event to display', function() {
            expect(controller.event).toEqual(mockEvent);
        });
    });

    describe("close", function() {
        it('should close modal instance', function() {
            controller.close();

            expect(mockModalInstance.dismiss).toHaveBeenCalledWith("cancel");
        });
    })
})
