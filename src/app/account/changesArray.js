export default class ChangesArray {
    constructor(objectsArray, comparer) {
        this._local = objectsArray;
        this._original = angular.copy(objectsArray);
        this._comparer = comparer;
    }
    
    get items() {
        return this._local.filter((item) => {
            return item._ca_should_remove !== true;
        });
    }
    
    get originalItems() {
        return this._original;
    }
    
    get newItems() {
        return this._local.filter((item) => { return item._ca_is_new === true;});        
    }
    
    get updatedItems() {
        return this._local.filter((item, index) => { 
            return item._ca_is_new !== true && !this.compare(index);
        });
    }
    
    get removedItems() {
        return this._local.filter((item) => { return item._ca_should_remove === true;});
    }
    
    get hasChanges() {
        return this.checkForChanges();
    }
    
    add(object) {
        object._ca_is_new = true;
        this._local.push(object);
    }
    
    remove(index) {
        if(this._local[index]._ca_is_new) {
            this._local.splice(index, 1);
        }else {
            this._local[index]._ca_should_remove = true;
        }
    }
    
    saveChanges() {
        this._local = this._local.filter((item) => { return item._ca_should_remove !== true;})
            .map((item) => {
                item._ca_is_new = false;
                return item;
            });
        this._original = angular.copy(this._local);
    }
    
    discardChanges() {
        this._local = angular.copy(this._original);
    }
    
    checkForChanges() {
        if(this._local.length !== this._original.length) {
            return true;
        } else if( this.removedItems.length > 0){
            return true;
        } else {
            for(let i = 0; i < this._local.length; i++) {
                let areDifferences = !this.compare(i);
                if(areDifferences) {
                    return true;
                }
            }
            return false;
        }
    }
    
    compare(index) {
        return this._comparer(this._local[index], this._original[index]);
    }
        
}