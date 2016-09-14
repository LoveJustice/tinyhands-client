import ChangesArray from './changesArray';

describe('ChangesArray', () => {
    let target,
        objectsArray,
        comparer,
        copier;
    
    beforeEach(() => {
        objectsArray = [{id: 1, name: 'Foo'}, {id: 2, name: 'bar'}];
        comparer = jasmine.createSpy().and.callFake((obj1, obj2) => {
            if(obj1.id === obj2.id && obj1.name === obj2.name && obj1.age === obj2.age) {
                return true;
            } else {
                return false;
            }
        });
        
        copier = jasmine.createSpy().and.callFake((arrayToCopy) => {
            return arrayToCopy.map((item) => {
               return {
                   id: item.id,
                   name: item.name,
                   age: item.age
               };
            });
        });
        
        target = new ChangesArray(objectsArray, copier, comparer);
    });
    
    describe('items', () => {
        it('should return array of objects', () => {
            let result = target.items;
            
            expect(result).toEqual(objectsArray);
        });
        
        it('should not return items marked for removal', () => {
            objectsArray[0]._ca_should_remove = true;
            
            let result = target.items;
            
            expect(result).toEqual([objectsArray[1]]);
        });
    });
    
    describe('updatedItems', () => {
        it('should return items that have been updated', () => {
            objectsArray[0].age = 23;
            
            let result = target.updatedItems;
            
            expect(result).toEqual([objectsArray[0]]);
        });
        
        it('should not return items that have been added', () => {
            target.add({id: 3, name: 'Quux'});
            objectsArray[0].age = 23;
            
            let result = target.updatedItems;
            
            expect(result).toEqual([objectsArray[0]]);
        });
    });
    
    describe('removedItems', () => {
        it('should return items marked for removal', () => {
            target.remove(0);
            
            let result = target.removedItems;
            
            expect(result).toEqual([objectsArray[0]]);
        });
    });
    
    describe('hasChanges', () => {
        describe('when no changes to items', () => {
            it('should return false', () => {
                let result = target.hasChanges;
                
                expect(result).toEqual(false);
            });
        });
        
        describe('when new item added', () => {
            it('should return true', () => {
                target.add({id: 3, name: 'Quux'});
                
                let result = target.hasChanges;
                
                expect(result).toEqual(true);
            });
        });
        
        describe('when item updated', () => {
            it('should return true', () => {
                objectsArray[0].age = 23;
                
                let result = target.hasChanges;
                
                expect(result).toEqual(true);
            });
        });
        
        describe('when item removed', () => {
            it('should return true', () => {
                target.remove(0);
                
                let result = target.hasChanges;
                
                expect(result).toEqual(true);
            });
        });
    });
    
    describe('add', () => {
        it('should mark item as new', () => {
            let newItem = {id: 3, name: 'Quux'};
            
            target.add(newItem);
            
            expect(newItem._ca_is_new).toEqual(true);
        });
        
        it('should add item to array', () => {
            let newItem = {id: 3, name: 'Quux'};
            
            target.add(newItem);
            
            expect(target.items.length).toEqual(3);
        });
    });
    
    describe('remove', () => {
        describe('when item to remove is new', () => {
            it('should remove item from array', () => {
                let newItem = {id: 3, name: 'Quux'};                
                target.add(newItem);
                
                target.remove(2);
            
                expect(target._local).toEqual([objectsArray[0], objectsArray[1]]);
            });
        });
        
        describe('when item to remove is not new', () => {
            it('should mark item for removal', () => {
                target.remove(0);
            
                expect(objectsArray[0]._ca_should_remove).toEqual(true);
            });
        });
    });
    
    describe('saveChanges', () => {
        it('should save changes made to array', () => {
            let newItem = {id: 3, name: 'Quux'};                
            target.add(newItem);
            
            target.saveChanges();
            
            expect(target.hasChanges).toEqual(false);
            expect(target.items).toEqual([objectsArray[0], objectsArray[1], newItem]);
        });
    });
    
    describe('discardChanges', () => {
        it('should revert array back to original', () => {
            let objectsArrayCopy = copier(objectsArray);
            let newItem = {id: 3, name: 'Quux'};                
            target.add(newItem);
            target.remove(0);
            
            target.discardChanges();
            
            expect(target.hasChanges).toEqual(false);
            expect(target.items).toEqual(objectsArrayCopy);
        });
    });
});