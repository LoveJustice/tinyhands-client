export default class AccountUtilities {
  constructor() {
    this.saveText= "Save All";
    this.savingText = "Saving...";
    this.savedText = "Saved";
    this.saveColor = "btn-success";
    this.savingColor = "btn-success";
    this.savedColor = "btn-primary";
  }

  toggleModified(permissionsSets, index, savedPermissionsSets) {
    // Checks if pSet is new. If it is, there is no need to check if it has been modified.
    var keys = Object.keys(permissionsSets[index]);
    keys.forEach((key) => {
      // Checks if a permission value on local copy differs from a permission value in database
      // Ignores '$$hashKey' key, which angular adds when copying an object.
      // It also ignores 'is_modified', since savedPermissionsSets does not have that property.
      if (key != '$$hashKey' && key != 'is_modified' && permissionsSets[index][key] != savedPermissionsSets[index][key]) {
        return true;
      }
    });
    return false;
  }

  checkForUnsavedChanges(permissionSets, savedPermissionsSets) {
    if (permissionsSets.length > savedPermissionsSets.length){
        return true;
    } else {
        permissionsSets.forEach((pSet) => {
          if (pSet.is_modified) { return true }
        });
    }

    if (unsaved){
        this.updateSaveButton(this.saveText, this.saveColor);
        this.unsavedChanges = true;
    } else {
        this.updateSaveButton(this.savedText, this.savedColor);
        this.unsavedChanges = false;
    }
  }

}