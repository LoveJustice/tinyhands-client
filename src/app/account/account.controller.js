export default class AccountController {
    constructor($state, $scope) {
        'ngInject';
        this.$state = $state;
        this.setActiveTab();
        
        this.tabs = [
            { name: 'Accounts List' , state: 'accounts.list'},
            { name: 'Access Control' , state: 'accounts.control'},
            { name: 'Access Defaults' , state: 'accounts.defaults'}
        ];
        
        $scope.$on('$stateChangeSuccess', () => {
            this.setActiveTab();
        });

    }
    
    setActiveTab() {
        this.activeTabIndex = this.$state.current.data.index; 
    }

    switchTab(index){
        if(this.activeTabIndex !== index) {
            let state = this.tabs[index].state;
            this.$state.go(state);
        }
    }
}
