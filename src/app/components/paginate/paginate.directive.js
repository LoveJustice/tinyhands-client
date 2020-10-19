import paginateTemplate from './paginate.html';
import './paginate.less';

class PaginateController {
    constructor($scope) {
        'ngInject';
        this.$scope = $scope;
        this.pageControl = $scope.pageControl;
        this.controller = $scope.controller;
    }
    
    getNumberOfPages() {
        this.numberOfPages = Math.ceil((this.pageControl.items * 1.0) /this.pageControl.pageSize); 
        return this.numberOfPages; 
    }
    
    shouldDisplay() {
        return this.getNumberOfPages() > 1;
    }
    
    getDisplayCount() {
        let numberOfPages = this.getNumberOfPages();
        let displayCount = 10;
        if (numberOfPages < 10) {
            displayCount = numberOfPages;
        }
        return displayCount;
    }
    
    getDisplayWidth() {
        return (this.getDisplayCount() + 2) * 60;
    }
    
    getPageNumbers() {
        let numberOfPages = this.getNumberOfPages();
        let displayCount = this.getDisplayCount();
        let startPos = 1;
        if (numberOfPages < 11 || this.pageControl.currentPage < 6) {
            startPos = 1;
        } else if (this.pageControl.currentPage + 5 > numberOfPages) {
            startPos = numberOfPages - 9;
        } else {
            startPos = this.pageControl.currentPage - 4;
        }
        let pageNumbers = [];
        for (let idx=0; idx < displayCount; idx++) {
            pageNumbers.push(startPos + idx);
        }
        return pageNumbers;
    }
    
    shouldDisplayPrevious() {
        return this.pageControl.currentPage > 1;
    }
    
    shouldDisplayNext() {
        return this.pageControl.currentPage < this.numberOfPages;
    }
    
    pageSelected(pageNumber) {
        this.controller.showPage(pageNumber);
    }
}

export default function PaginateDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: paginateTemplate,
        controller: PaginateController,
        controllerAs: 'paginateController',
        scope: {
            pageControl: '=?',
            controller: '=?',
        }
    };

    return directive;
}
