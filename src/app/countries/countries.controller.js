import EditCountryModalTemplate from './countryModal.html';


class CountriesController {
    constructor(StickyHeader, $rootScope, $scope, $http, $timeout, countriesService, $uibModal) {
        'ngInject';

        this.stickyOptions = StickyHeader.stickyOptions;
        this.countriesService = countriesService;
        this.searchValue = "";
        this.paginateBy = 25;
        this.nextPageUrl = "";
        this.sortColumn = "";
        this.reverse = false;
        this.loading = false;
        this.countries = [];
        this.modal = $uibModal;

        this.getCountries();
    }

    sortIcon(column) {
        if (column === this.sortColumn) {
            switch (column) {
                case "name":
                    return this.reverse ? "glyphicon-sort-by-alphabet-alt" : "glyphicon-sort-by-alphabet";
                default:
                    return "glyphicon-sort";
            }
        }
        return "glyphicon-sort";
    }

    getCountries() {
        this.loading = true;
        this.countriesService.getCountries(this.getQueryParams())
            .then((promise) => {
                this.countries = promise.data.results;
                this.nextPageUrl = this.nextUrl(promise.data.next);
                this.loading = false;
            });
    }

    getQueryParams(loadMore = false) {
        let params = [];
        params.push({ "name": "page_size", "value": this.paginateBy });
        if (this.nextPageUrl && loadMore) {
            params.push({ "name": "page", "value": this.nextPageUrl });
        }
        if (this.searchValue) {
            params.push({ "name": "search", "value": this.searchValue });
        }
        if (this.sortColumn) {
            if (this.reverse) {
                params.push({ "name": "ordering", "value": ("-" + this.sortColumn.replace(".", "__")) });
            } else {
                params.push({ "name": "ordering", "value": (this.sortColumn.replace(".", "__")) });
            }
        }
        return params;
    }

    editCountry(country) {
        let modalInstance = this.modal.open({
            animation: true,
            templateUrl: EditCountryModalTemplate,
            controller: 'CountryModalController as vm',
            size: 'md',
            resolve: {
                country: function () {
                    return country;
                }
            }
        });
        modalInstance.result.then((country) => {
            this.countriesService.saveCountry(country)
                .then(() => {
                    this.getCountries();
                });
        });
    }

    addCountry(country) {
      let modalInstance = this.modal.open({
          animation: true,
          templateUrl: EditCountryModalTemplate,
          controller: 'CountryModalController as vm',
          size: 'md',
          resolve: {
              country: function () {
                  return country;
              }
          }
      });
      modalInstance.result.then((country) => {
          this.countriesService.addCountry(country)
              .then(() => {
                  this.getCountries();
              });
      });
    }

    loadMoreCountries() {
        this.loading = true;
        this.countriesService.loadMoreCountries(this.getQueryParams(true))
            .then((promise) => {
                this.countries = this.countries.concat(promise.data.results);
                this.nextPageUrl = this.nextUrl(promise.data.next);
                this.loading = false;
            });
    }

    nextUrl(url) {
        if (url) {
            url = url.match(/page=\d+/);
            if (url) {
                url = url[0].match(/\d+/)[0];
            }
        }
        return url;
    }

}

export default CountriesController;
