import ConfirmButtonController from './confirmButton.controller';

describe('ConfirmButtonController', () => {

    let controller, scope;

    beforeEach(() => {
        scope = {
            onClick: () => { },
            onConfirm: () => { },
            text: "Foo",
            confirmText: "Bar"
        }
        spyOn(scope, 'onClick');
        spyOn(scope, 'onConfirm');
        controller = new ConfirmButtonController(scope);
    });

    describe('buttonText', () => {

        describe('when isFirstClick', () => {
            it('should return scope.text', () => {
                controller.isFirstClick = true;
                expect(controller.buttonText).toEqual(scope.text);
            });
        });

        describe('when not isFirstClick', () => {
            it('should return scope.confirmText', () => {
                controller.isFirstClick = false;
                expect(controller.buttonText).toEqual(scope.confirmText);
            });
        });
    });

    describe('onClick', () => {

        it('should toggle isFirstClick', () => {
            let value = true;
            controller.isFirstClick = value;

            controller.onClick();

            expect(controller.isFirstClick).toEqual(!value);
        });

        describe('when isFirstClick', () => {
            it('should call scope.onClick', () => {
                controller.isFirstClick = true;

                controller.onClick();

                expect(scope.onClick).toHaveBeenCalled();
            });
        });

        describe('when not isFirstClick', () => {
            it('should call scope.onConfirm', () => {
                controller.isFirstClick = false;

                controller.onClick();

                expect(scope.onConfirm).toHaveBeenCalled();
            });
        });
    });

    describe('onCancel', () => {
        it('should set isFirstClick to true', () => {
            controller.isFirstClick = false;

            controller.onCancel();

            expect(controller.isFirstClick).toEqual(true);
        });
    });
});