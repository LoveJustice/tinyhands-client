import PermissionsSetsService from './permissionsSets.service'

describe('PermissionsSetsService', () => {
    let service;

    let id = 234,
        data = {id: 'dataId'};

    beforeEach(inject(($http) => {
        service = new PermissionsSetsService($http);
    }));

    describe('function getPermissions', () => {
        let url = '/api/defaultPermissionsSet/';
        it(`should get called with ${url}`, () => {
            spyOn(service, 'get');
            service.getPermissions();
            expect(service.getPermissions).toHaveBeenCalledWith(url);
        });
    });

    describe('function getPermission', () => {
        let url = `/api/defaultPermissionsSet/${id}/`;
        it(`should get called with ${url}`, () => {
            spyOn(service, 'get');
            service.getPermission(id);
            expect(service.getPermission).toHaveBeenCalledWith(url);
        });
    });

    describe('function create', () => {
        let url = '/api/defaultPermissionsSet/';
        it(`should get called with ${url} and ${data}, () => {
            spyOn(service, 'post');
            service.create(data);
            expect(service.create).toHaveBeenCalledWith(url, data);
        });
    });

    describe('function update', () => {
        let url = `/api/defaultPermissionsSet/${id}/`;
        it(`should get called with ${url} and ${data}, () => {
            spyOn(service, 'put');
            service.update(id, data);
            expect(service.update).toHaveBeenCalledWith(url, data);
        });
    });

    describe('function destroy', () => {
        let url = `/api/defaultPermissionsSet/${id}/`;
        it(`should get called with ${url}, () => {
            spyOn(service, 'delete');
            service.destroy(id);
            expect(service.destroy).toHaveBeenCalledWith(url);
        });
    });
});

