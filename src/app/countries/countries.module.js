import countriesRouteConfig from './countries.route';
import CountriesController from './countries.controller';
import CountryModalController from './countryModal.controller';
import CountriesService from './countries.service';

export default angular.module('tinyhands.Countries', ['ui.router', 'tinyhands.Shared'])
                      .config(countriesRouteConfig)
                      .controller('CountriesController', CountriesController)
                      .controller('CountryModalController', CountryModalController)
                      .service('countriesService', CountriesService);
