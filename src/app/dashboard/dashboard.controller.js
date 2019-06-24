class DashboardController {
    constructor($rootScope, SessionService, DashboardService) {
        'ngInject';

        this.$rootScope = $rootScope;
        this.session = SessionService;
        this.service = DashboardService;

        this.showEvents = false;
        this.showTally = true;
        this.showAddress2Layer = false;
        this.showBorderStationLocations = false;
        this.countries = [];
        this.selectedCountry = null;
        this.selectedCountryName = null;
        this.getUserCountries();
    }
    
    getUserCountries() {
        this.service.getUserCountries(this.session.user.id).then(promise => {
            this.countries = promise.data;
            if (this.countries.length > 0) {
                this.selectedCountryName = window.localStorage.getItem('dashboard-country');
                for (let countryIdx in this.countries) {
                    if (this.countries[countryIdx].name === this.selectedCountryName) {
                        this.selectedCountry = this.countries[countryIdx];
                        break;
                    }
                }
                    
                if (this.selectedCountry === null) {
                    this.selectedCountry = this.countries[0];
                    this.selectedCountryName = this.countries[0].name;
                }
                
                this.setMapLocation();
            }
        });
    }
    
    changeCountry() {
        for (let countryIdx in this.countries) {
            if (this.countries[countryIdx].name === this.selectedCountryName) {
                this.selectedCountry = this.countries[countryIdx];
                this.setMapLocation();
                break;
            }
        }
    }

    toggleAddress2Layer() {
        this.$rootScope.$emit('toggleAddress2Layer', this.showAddress2Layer);
    }

    toggleBorderStationLocations() {
        this.$rootScope.$emit('toggleBorderStationLocations', this.showBorderStationLocations);
    }
    
    setMapLocation() {
        window.localStorage.setItem('dashboard-country', this.selectedCountry.name);
        this.$rootScope.$emit('mapLocation', this.selectedCountry);
    }

}
export default DashboardController;
