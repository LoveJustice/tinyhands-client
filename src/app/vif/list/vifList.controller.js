export default class VifList {
    // Variable Declarations
    var header = "All VIFs";
    var loading = false;
    var reverse = false;
    var vifs = [];
    var user = {};
    var searchValue = "";
    var nextPageUrl = "";
    var paginateBy = 25;
    var sortIcon = "/static/images/sortIcon.jpg";
    var selectedAddress = {};
    var sortColumn = "vif_number";


    //////////////////////////////////////////////////////


    constructor(VifListService) {
        'ngInject';
        this.service = VifListService;

        this.getVifList();
    }

    getVifList() {
        this.service.getVifList().then((response) => {
            this.listOfVifs = response.data.results;
        });
    }

    main(){
        if(window.search == 1){
            searchValue = window.station_code;
            header = "All VIFs for " + searchValue;
        }
        listVifs();
        getUser();
    }

    getUser(){
        $http.get('/api/me/')
            .success(function(data){
                user = data
            });
    }

    getSortIcon(column, name){
        if(name === sortColumn){
            switch (column) {
                case "number":
                    return reverse ? "glyphicon-sort-by-order-alt" : "glyphicon-sort-by-order";
                case "letter":
                    return reverse ? "glyphicon-sort-by-alphabet-alt" : "glyphicon-sort-by-alphabet";
                default:
                    return "glyphicon-sort";
            }
        }
        return "glyphicon-sort";
    }

    listVifs(){
        loading = true;
        vifService.listVifs(getQueryParams())
            .success(function (data) {
                vifs = data.results;
                nextPageUrl = data.next;
                loading = false;
            });
    }

    loadMoreVifs(){
        loading = true;
        vifService.loadMoreVifs(nextPageUrl, "&" + getQueryParams().slice(1))
            .success(function (data) {
                vifs = vifs.concat(data.results);
                nextPageUrl = data.next;
                loading = false;
            });
    }

    searchVifs(){
        loading = true;
        vifService.listVifs(getQueryParams())
            .success(function (data) {
                vifs = data.results;
                if(searchValue) {
                    header = "All VIFs for " + searchValue;
                }
                else {
                    header = "All VIFs";
                }
                nextPageUrl = data.next;
                loading = false;
            });
    }

    deleteVif(vif) {
        if(vif.confirmedDelete){
            loading = true;
            vifService.deleteVif(vif.delete_url)
                .success(function(){
                    listVifs();
                    loading = false;
                })
                .error(function(){
                    loading = false;
                    alert("you did not have authorization to delete that VIF");
                });
        }
        else{
            vif.confirmedDelete = true;
        }
    }

    getQueryParams(){
        var params = "";
        params += "?page_size=" + paginateBy;
        if(searchValue){
            params += "&search=" + searchValue;
        }
        if(reverse){
            params += "&ordering=-" + sortColumn;
        } else{
            params += "&ordering=" + sortColumn;
        }
        return params;
    }
}
