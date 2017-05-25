import IdManagementController from './idmanagement.controller';

describe('IdManagementController', () => {
    let vm;
    let mockStickyHeader,
        $rootScope,
        $scope,
        $timeout,
        $q,
        idManagementService,
        $uibModal,
        $state,
        $stateParams,
        document,
        mockToastr;

    let knownPersons = [

    ];

    beforeEach(inject(($http, _$rootScope_, _$q_) => {
        $q = _$q_;
        mockStickyHeader = jasmine.createSpyObj('StickyHeader', ['stickyOptions']);
        mockToastr = jasmine.createSpyObj('mockToastr', ['success', 'error']);
        idManagementService = jasmine.createSpyObj('mockService', ['listKnownPersons']);


        idManagementService.listKnownPersons.and.callFake(() => {
            return $q.resolve({data: knownPersons});
        });

        $stateParams = {};
        $state = {go: () => {}};
        $rootScope = _$rootScope_;
        $scope = {};

        vm = new IdManagementController(mockStickyHeader, $rootScope, $scope, $http, $timeout, idManagementService, $uibModal, $state, $stateParams, document, mockToastr);
    }));
    
    describe('function constructor', () => {
        it('reverse should be false', () => {
            expect(vm.reverse).toBe(false);
        });

        it('paginateBy should be 25 by default', () => {
            expect(vm.paginateBy).toEqual(25);
        });

        it('addresses should be an empty array', () => {
            expect(vm.knownPersons).toEqual([]);
        });

        it('searchValue should be an empty string', () => {
            expect(vm.searchValue).toEqual("");
        });

        it('nextPageUrl should be an empty string', () => {
            expect(vm.nextPageUrl).toEqual("");
        });

        it('sortColumn should be an empty string', () => {
            expect(vm.sortColumn).toEqual("");
        });
        
        it('addSearchValue should be an empty string', () => {
            expect(vm.addSearchValue).toEqual("");
        });
        
        it('showIdMgmt should be true', () => {
            expect(vm.showIdMgmt).toBe(true);
        });
        
        it('showAddAlias should be false', () => {
            expect(vm.showAddAlias).toBe(false);
        });
        
        it('showRemoveAlias should be false', () => {
            expect(vm.showRemoveAlias).toBe(false);
        });
    });
    
    describe("function sortIcon", () => {
        it("if reverse is true, should return string: glyphicon-sort-by-alphabet-alt", () => {
            vm.reverse = true;
            vm.sortColumn = "name";
            let fetchedStr = vm.sortIcon('name');
            expect(fetchedStr).toEqual('glyphicon-sort-by-alphabet-alt');
        });

        it("if reverse is false, should return string: glyphicon-sort-by-alphabet", () => {
            vm.reverse = false;
            vm.sortColumn = "name";
            let fetchedStr = vm.sortIcon('name');
            expect(fetchedStr).toEqual('glyphicon-sort-by-alphabet');
        });
    });
    
    describe("function search known persons", () => {
        let response = { "data": { 'results': 'page1', 'next': 'test.com/page=469876' } };
        beforeEach(() => {
            vm.idManagementService.listKnownPersons = () => {
                return {
                    then: (f) => {
                        f(response);
                    }
                };
            };
            vm.getKnownPersons();
        });

        it("loading should be false", () => {
            expect(vm.loading).toBe(false);
        });

        it("persons should append onto knownPersons[]", () => {
            expect(vm.knownPersons).toEqual('page1');
        });

        it("should change nextPageUrl", () => {
            expect(vm.nextPageUrl).toEqual('469876');
        });
    });
    
    describe("function loadMoreKnownPersons", () => {
        let response = { "data": { 'results': 'page1', 'next': 'test.com/page=469876' } };
        beforeEach(() => {
            vm.idManagementService.loadMoreKnownPersons = () => {
                return {
                    then: (f) => {
                        f(response);
                    }
                };
            };
            vm.loadMoreKnownPersons();
        });

        it("loading should be false", () => {
            expect(vm.loading).toBe(false);
        });

        it("persons should append onto knownPersons[]", () => {
            expect(vm.knownPersons).toEqual(['page1']);
        });

        it("persons should change nextPageUrl", () => {
            expect(vm.nextPageUrl).toEqual('469876');
        });
    });
    
    describe("function getQueryParams", () => {
        it("if param's nextPageURL is not null, should push onto params page_size & paginateBy with their respective values", () => {
            let params = vm.getQueryParams();
            expect(params).toContain({ "name": "page_size", "value": vm.paginateBy });
        });

        it("if param's nextPageURL is not null, params should contain {name: page, value: vm.nextPageUrl}", function () {
            vm.nextPageUrl = 'testURL.html';
            let loadMore = true;
            let params = vm.getQueryParams(loadMore);
            expect(params).toContain({ "name": "page", "value": vm.nextPageUrl });
        });

        it("if param's searchVal is not null, params should contain {name: search, value: vm.searchValue}", function () {
            vm.searchValue = "testString";
            let params = vm.getQueryParams();
            expect(params).toContain({ "name": "search", "value": vm.searchValue });
        });

        it("if param's sortColumn is not null AND reverse is true, params should contain {name: ordering, value: -sortColumn}", function () {
            vm.sortColumn = "testString";
            vm.reverse = true;
            let params = vm.getQueryParams();
            expect(params).toContain({ "name": "ordering", "value": ("-" + vm.sortColumn.replace(".", "__")) });
        });

        it("if param's sortColumn is not null AND reverse is false, params should contian {name: ordering, value: sortColumn}", function () {
            vm.sortColumn = "testString2";
            vm.reverse = false;
            let params = vm.getQueryParams();
            expect(params).toContain({ "name": "ordering", "value": (vm.sortColumn.replace(".", "__")) });
        });
    });

    describe('function nextUrl', () => {
        it("if url is null, should return null", () => {
            let emptyString = null;
            let url = vm.nextUrl(emptyString);
            expect(url).toBe(null);
        });

        it("Checks that the regex passes with a valid input", () => {
            let testURL = "test.com/page=469876";
            let url = vm.nextUrl(testURL);
            expect(url).toBe("469876");
        });


        it("Checks that the regex fails with an invalid input", () => {
            let testURL = "test.com";
            let url = vm.nextUrl(testURL);
            expect(url).toBe(null);
        });
    });
    
    describe('function addGroupSearch', () => {
    	let fuzzyResponse = { "data": 'Name-Candidates' };
    	let phoneResponse = { "data": 'Phone-Candidates' };
    	let knownperson = {full_name: 'foo', id: 123};
    	
        beforeEach(() => {
            vm.idManagementService.getFuzzyKnownPersons = () => {
                return {
                    then: (f) => {
                        f(fuzzyResponse);
                    }
                };
            };
            vm.idManagementService.getPhoneKnownPersons = () => {
                return {
                    then: (f) => {
                        f(phoneResponse);
                    }
                };
            };
        });
        
    	it("addCandidates should be Name-Candidates", () => {
    		vm.addSearchOption = "name";
    		vm.addGroupSearch(knownperson);
            expect(vm.addCandidates).toEqual('Name-Candidates');
        });
    	
    	it("addCandidates should be Phone-Candidates", () => {
    		vm.addSearchOption = "phone";
    		vm.addGroupSearch(knownperson);
            expect(vm.addCandidates).toEqual('Phone-Candidates');
        });
    });
    
    describe('function getForms', () => {
    	let formsResponse = { "data": 'Forms' };
    	let person_id = 123;
    	
        beforeEach(() => {
            vm.idManagementService.getKnownPersonForms = () => {
                return {
                    then: (f) => {
                        f(formsResponse);
                    }
                };
            };
            vm.getForms(person_id);
        });
        
        it("forms should be Forms", () => {
            expect(vm.forms).toEqual('Forms');
        });
    });
    
    describe('function aliasMgmtAdd', () => {
    	let fuzzyResponse = { "data": 'Candidates' };
    	let formsResponse = { "data": 'Forms' };
    	let knownperson = {full_name: 'foo', id: 123};
    	
        beforeEach(() => {
            vm.idManagementService.getFuzzyKnownPersons = () => {
                return {
                    then: (f) => {
                        f(fuzzyResponse);
                    }
                };
            };
            vm.idManagementService.getKnownPersonForms = () => {
                return {
                    then: (f) => {
                        f(formsResponse);
                    }
                };
            };
            vm.aliasMgmtAdd(knownperson);
        });
        
    	it("addSearchOption should be name", () => {
            expect(vm.addSearchOption).toEqual('name');
        });
    	
        it("addSearchValue should be foo", () => {
            expect(vm.addSearchValue).toEqual('foo');
        });
        
        it("showIdMgmt should be false", () => {
            expect(vm.showIdMgmt).toBe(false);
        });
        
        it("showAddAlias should be true", () => {
            expect(vm.showAddAlias).toBe(true);
        });
        
        it("showremoveAlias should be false", () => {
            expect(vm.showremoveAlias).toBe(false);
        });
        
        it("matchSelected should be false", () => {
            expect(vm.matchSelected).toBe(false);
        });
        
        it("addCandidates should be Candidates", () => {
            expect(vm.addCandidates).toEqual('Candidates');
        });
        
        it("forms should be Forms", () => {
            expect(vm.forms).toEqual('Forms');
        });
    });
    
    describe('function cancelAdd with isViewing true', () => {
        beforeEach(() => {
        	vm.isViewing = true;
        	vm.cancelAdd();
        });
        
    	it("showIdMgmt should be false", () => {
            expect(vm.showIdMgmt).toBe(false);
        });
    	
    	it("showAddAlias should be true", () => {
            expect(vm.showAddAlias).toBe(true);
        });
    	
    	it("showRemoveAlias should be false", () => {
            expect(vm.showRemoveAlias).toBe(false);
        });
    	
    	it("isViewing should be false", () => {
            expect(vm.isViewing).toBe(false);
        });
	});
    
    describe('function cancelAdd with isViewing false', () => {
        beforeEach(() => {
        	vm.isViewing = false;
        	vm.cancelAdd();
        });
        
    	it("showIdMgmt should be true", () => {
            expect(vm.showIdMgmt).toBe(true);
        });
    	
    	it("showAddAlias should be false", () => {
            expect(vm.showAddAlias).toBe(false);
        });
    	
    	it("showRemoveAlias should be false", () => {
            expect(vm.showRemoveAlias).toBe(false);
        });
    	
    	it("isViewing should be false", () => {
            expect(vm.isViewing).toBe(false);
        });
    });
    
    describe('function addAliasGroup', () => {
        let addAliasGroup = () => {
            return {
                then: (f) => {
                    f();
                }
            };
        };
        let knownperson = {full_name: 'foo', id: 123};
       

        beforeEach(() => {
            vm.idManagementService.addAliasGroup = addAliasGroup;
            vm.knownperson = knownperson;
            vm.addSelectedId = 543;
            vm.addAliasGroup();
        });
        
        it("function addAliasGroup should be called", () => {
            spyOn(vm.idManagementService, "addAliasGroup").and.callThrough();
            vm.addAliasGroup();
            expect(idManagementService.addAliasGroup).toHaveBeenCalled();
        });
        
    	it("showIdMgmt should be true", () => {
            expect(vm.showIdMgmt).toBe(true);
        });
    	
    	it("showAddAlias should be false", () => {
            expect(vm.showAddAlias).toBe(false);
        });
    	
    	it("showRemoveAlias should be false", () => {
            expect(vm.showRemoveAlias).toBe(false);
        });
    });
    
    describe('function enableMatch', () => {
    	let personId = 123; 

        beforeEach(() => {
            vm.enableMatch(personId);
        });
        
    	it("addSelectedId should be 123", () => {
            expect(vm.addSelectedId).toEqual(123);
        });
    	
    	it("matchSelected should be true", () => {
            expect(vm.matchSelected).toBe(true);
        });
    });
    
    describe('function aliasGroupDetail', () => {
    	 let knownperson = {full_name: 'foo', id: 123, alias_group : 987};
    	 let aliasMembersResponse = {data : 'aliasMembers'};

        beforeEach(() => {
        	vm.idManagementService.getAliasMembers = () => {
                return {
                    then: (f) => {
                        f(aliasMembersResponse);
                    }
                };
            };
            vm.aliasGroupDetail(knownperson);
        });
        
    	it("delCandidates should be aliasMembers", () => {
            expect(vm.delCandidates).toEqual('aliasMembers');
        });
    	
    	it("knownperson matches", () => {
            expect(vm.knownperson).toBe(knownperson);
        });
    	
    	it("isViewing is true", () => {
            expect(vm.isViewing).toBe(true);
        });
    	
       	it("showIdMgmt is false", () => {
            expect(vm.showIdMgmt).toBe(false);
        });
       	
      	it("showAddAlias is false", () => {
            expect(vm.showAddAlias).toBe(false);
        });
      	
      	it("showRemoveAlias is false", () => {
            expect(vm.showRemoveAlias).toBe(true);
        });
      	
      	it("removeModified is false", () => {
            expect(vm.removeModified).toBe(false);
        });
    });
    
    describe('function aliasMgmtDelete', () => {
    	let knownperson = {full_name: 'foo', id: 123, alias_group : 987};
    	let aliasMembersResponse = {data : 'aliasMembers'};

    	beforeEach(() => {
    		vm.idManagementService.getAliasMembers = () => {
               return {
                   then: (f) => {
                       f(aliasMembersResponse);
                   }
               };
    		};
    		vm.aliasMgmtDelete(knownperson);
    	});
       
    	it("delCandidates should be aliasMembers", () => {
    		expect(vm.delCandidates).toEqual('aliasMembers');
    	});
   	
    	it("knownperson matches", () => {
           expect(vm.knownperson).toBe(knownperson);
    	});
   	
    	it("isViewing is false", () => {
           expect(vm.isViewing).toBe(false);
    	});
   	
    	it("showIdMgmt is false", () => {
           expect(vm.showIdMgmt).toBe(false);
    	});
      	
    	it("showAddAlias is false", () => {
           expect(vm.showAddAlias).toBe(false);
    	});
     	
    	it("showRemoveAlias is false", () => {
           expect(vm.showRemoveAlias).toBe(true);
    	});
     	
    	it("removeModified is false", () => {
           expect(vm.removeModified).toBe(false);
    	});
	});

    describe('function getAliasGroup', () => {
    	let group_id = 987;
    	let aliasMembersResponse = {data : 'aliasMembers'};

    	beforeEach(() => {
    		vm.idManagementService.getAliasMembers = () => {
               return {
                   then: (f) => {
                       f(aliasMembersResponse);
                   }
               };
    		};
    		vm.getAliasGroup(group_id);
    	});
       
    	it("delCandidates should be aliasMembers", () => {
    		expect(vm.delCandidates).toEqual('aliasMembers');
    	});
   	
    	it("loading is false", () => {
           expect(vm.loading).toBe(false);
    	});
	});
    
    describe('function deleteFromGroup', () => {
    	let group_id = 987;
    	let aliasMembersResponse = {data : 'aliasMembers'};

    	beforeEach(() => {
    		vm.idManagementService.removeAliasGroup = () => {
    			return {
                    then: (f) => {
                        f();
                    }
                };
    		};
    		vm.idManagementService.getAliasMembers = () => {
               return {
                   then: (f) => {
                       f(aliasMembersResponse);
                   }
               };
    		};
    	});
       
    	it("delCandidates should be aliasMembers", () => {
    		vm.getAliasGroup(group_id);
    		expect(vm.delCandidates).toEqual('aliasMembers');
    	});
   	
    	it("removeModified is false", () => {
    		vm.getAliasGroup(group_id);
           expect(vm.loading).toBe(false);
    	});
	});
    
    describe('function viewDeleteDone when isViewing is true', () => {
    	beforeEach(() => {
    		vm.isViewing = true;
    		vm.viewDeleteDone();
    	});
       
    	it("showIdMgmt should be false", () => {
    		expect(vm.showIdMgmt).toBe(false);
    	});
    	
    	it("showAddAlias should be true", () => {
    		expect(vm.showAddAlias).toBe(true);
    	});
    	
    	it("showRemoveAlias should be false", () => {
    		expect(vm.showRemoveAlias).toBe(false);
    	});
    	
    	it("isViewing should be false", () => {
    		expect(vm.isViewing).toBe(false);
    	});
	});
    
    describe('function viewDeleteDone when isViewing is false', () => {
    	beforeEach(() => {
    		vm.isViewing = false;
    		vm.viewDeleteDone();
    	});
       
    	it("showIdMgmt should be true", () => {
    		expect(vm.showIdMgmt).toBe(true);
    	});
    	
    	it("showAddAlias should be false", () => {
    		expect(vm.showAddAlias).toBe(false);
    	});
    	
    	it("showRemoveAlias should be false", () => {
    		expect(vm.showRemoveAlias).toBe(false);
    	});
    	
    	it("isViewing should be false", () => {
    		expect(vm.isViewing).toBe(false);
    	});
	});
});