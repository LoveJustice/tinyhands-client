import PermissionsSetsService from './permissionsSets.service'

describe('PermissionsSetsService', () => {
    let service,
        mockBaseService;

    let id = 234,
        data = { id: 'dataId' };

    beforeEach(() => {
        mockBaseService = jasmine.createSpyObj('mockBaseService', ['get', 'post', 'put', 'delete']);
        service = new PermissionsSetsService(mockBaseService);
    });

    describe('getPermissions', () => {
        it('should call BaseService.get with correct url', () => {
            let url = 'api/defaultPermissionsSet/';

            service.getPermissions();

            expect(mockBaseService.get).toHaveBeenCalledWith(url);
        });
    });

    describe('getPermission', () => {
        it('should call BaseService.get with correct url', () => {
            let url = `api/defaultPermissionsSet/${id}/`;

            service.getPermission(id);

            expect(mockBaseService.get).toHaveBeenCalledWith(url);
        });
    });

    describe('create', () => {
        it('should call BaseService.post with correct url and data', () => {
            let url = 'api/defaultPermissionsSet/';

            service.create(data);

            expect(mockBaseService.post).toHaveBeenCalledWith(url, data);
        });
    });

    describe('update', () => {
        it('should call BaseService.put with correct url and data', () => {
            let url = `api/defaultPermissionsSet/${id}/`;

            service.update(id, data);

            expect(mockBaseService.put).toHaveBeenCalledWith(url, data);
        });
    });

    describe('destroy', () => {
        it('should call BaseService.delete with correct url', () => {
            let url = `api/defaultPermissionsSet/${id}/`;

            service.destroy(id);

            expect(mockBaseService.delete).toHaveBeenCalledWith(url);
        });
    });
});
