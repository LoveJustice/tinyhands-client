import countriesRouteConfig from './countries.route';
import CountriesController from './countries.controller';
import CountryAddModalController from './countryAddModal.controller';
import CountryEditModalController from './countryEditModal.controller';
import CountriesService from './countries.service';

export default angular.module('tinyhands.Countries', ['ui.router', 'tinyhands.Shared'])
                      .config(countriesRouteConfig)
                      .controller('CountriesController', CountriesController)
                      .controller('CountryAddModalController', CountryAddModalController)
                      .controller('CountryEditModalController', CountryEditModalController)
                      .service('countriesService', CountriesService);
