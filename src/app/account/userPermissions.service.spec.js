import UserPermissionsService from './userPermissions.service';

describe('UserPermissionsService', () => {
    let service,
    mockBaseService;

    let id = 10022,
    data = { id: 'dataId' },
    params=[];

    beforeEach(() => {
        mockBaseService = jasmine.createSpyObj('mockBaseService', ['get', 'post', 'put', 'delete']);
        service = new UserPermissionsService(mockBaseService);
    });

    describe('getPermissions', () => {
        it('should call BaseService.get with correct url', () => {
            let url = 'api/permission/?page_size=1000';

            service.getPermissions();

            expect(mockBaseService.get).toHaveBeenCalledWith(url);
        });
    });

    describe('getUserPermissions', () => {
        it('should call BaseService.get with correct url', () => {
            let url = `api/user_permission/${id}/`;

            service.getUserPermissions(id);

            expect(mockBaseService.get).toHaveBeenCalledWith(url);
        });
    });

    describe('setUserPermissions', () => {
        it('should call BaseService.put with correct url and data', () => {
            let url = `api/user_permission/${id}/`;

            service.setUserPermissions(id, data);

            expect(mockBaseService.put).toHaveBeenCalledWith(url, data);
        });
    });

    describe('getAllCountries', () => {
        it('should call BaseService.get with correct url', () => {
            let url = 'api/country/?page_size=1000';

            service.getAllCountries();

            expect(mockBaseService.get).toHaveBeenCalledWith(url);
        });
    });

    describe('getBorderStations', () => {
        it('should call BaseService.get with correct url', () => {
            let url = 'api/border-station/';

            service.getBorderStations();
            let params = [{name:'page_size', value:1000}];

            expect(mockBaseService.get).toHaveBeenCalledWith(url, params);
        });
    });
    
    describe('getUserPermissionsList', () => {
        it('should call BaseService.get with correct url', () => {
            let url = `api/user_permission_list/`;

            service.getUserPermissionsList(null, null);

            expect(mockBaseService.get).toHaveBeenCalledWith(url, params);
        });
    });
});