import './searchAddress.less';

export default class SearchAddressController {
    constructor($uibModal, $uibModalInstance, $scope, SearchAddressService, address) {
        'ngInject';
        this.$uibModalInstance = $uibModalInstance;
        this.scope = $scope;
        this.addressString = "";
        this.address = address;
        this.theCenter = "0, 0";
        this.zoomLevel = 1;
        this.selectedPosition = null;
        
        this.candidates = [];
        this.selectedCandidate = null;
        
        this.service = SearchAddressService;
        this.mapKey = null;
        this.getMapKey();
        if (this.address && this.address.location) {
            this.addressString = this.address.address;
            this.selectCandidate(-1);
        }
    }
    
    getMapKey() {
        this.service.getMapKey().then((response) => { this.mapKey = response.data; });
    }
    
    get apiUrl() {
        let api = null;
        if (this.mapKey) {
            api = "https://maps.google.com/maps/api/js?key=" + this.mapKey;
        }
        return api;
    }
    
    get center() {
        return this.theCenter;
    }
    
    get zoom() {
        return this.zoomLevel;
    }
    
    selectCandidate(index) {
        let sel = null;
        if (index < 0) {
            sel= this.address;
            this.searchValue = null;
            this.selectedCandidate = null;
        } else {
            sel = this.candidates[index];
            this.searchValue = index;
            this.selectedCandidate = sel;
        }
        
        this.theCenter = sel.location.y + ',' + sel.location.x;
        this.selectedPosition = [sel.location.y,sel.location.x];
        let xdiff = sel.extent.xmax - sel.extent.xmin;
        let ydiff = sel.extent.ymax - sel.extent.ymin;
        let diff = 0;
        if (xdiff > ydiff) {
            diff = xdiff;
        } else {
            diff = ydiff;
        }
        this.zoomLevel = Math.round(Math.log(400 * 360 / diff / 256) / Math.LN2);
    }
    
    keyPress(event) {
        if(event.keyCode === 13) {
            this.search();
        }
    }
    
    search() {
        this.candidates = [];
        this.selectedCandidate = null;
        this.searchValue = null;
        this.selectedPosition = null;
        this.service.searchAddresses(this.addressString).then((response) => { 
            this.candidates = response.data.candidates;
            $('#searchAddressScroll').scrollTop(0);
            });
    }
    
    save() {
        this.$uibModalInstance.close(this.selectedCandidate);
    }
    
    cancel() {
        this.$uibModalInstance.dismiss();
    }
    
    clearAddress() {
        this.$uibModalInstance.close("");
    }
}