export default class ConfirmButtonController {
    constructor($scope) {
        'ngInject';
        if(typeof $scope.onClick === 'function') {
            this.onClickCallback = $scope.onClick;
        }
        if(typeof $scope.onConfirm === 'function') {
            this.onConfirmCallback = $scope.onConfirm;
        }
        this.text = $scope.text;
        this.confirmText = $scope.confirmText;
        this.btnClass = $scope.btnClass;
        this.invisible = $scope.invisible;
        this.isFirstClick = true;
    }
    
    get buttonText() {
        if(this.isFirstClick) {
            return this.text;
        } else {
            return this.confirmText;
        }
    }
    
    onClick() {
        if(this.isFirstClick) {
            this.onFirstClick();
        }else {
            this.onSecondClick();
        }
        this.isFirstClick = !this.isFirstClick;
    }
    
    onFirstClick() {
        if(this.onClickCallback) {
            this.onClickCallback();
        }
    }
    
    onSecondClick() {
        if(this.onConfirmCallback) {
            this.onConfirmCallback();
        }
    }
    
    onCancel() {
        this.isFirstClick = true;
    }
}