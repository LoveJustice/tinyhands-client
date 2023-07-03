export default class DiscussProjectRequestModalController{
	constructor($uibModalInstance, SpinnerOverlayService, $scope, service, request, userId) {
		this.$uibModalInstance = $uibModalInstance;
		this.spinner = SpinnerOverlayService;
		this.$scope = $scope;
		this.service = service;
		this.request = request;
		this.userId = userId;
		this.modified = false;
		
		this.discussionText = '';
		this.notifyAccount = '';
		this.discussionEntries = null;
		this.notifyAccounts = null;
		this.discussionStatus = request.discussion_status;
		
		this.accountDropDown = {};
        this.accountDropDown.options = [];
        this.accountDropDown.selectedOptions = [];
        this.accountDropDown.settings = {smartButtonMaxItems:2, showCheckAll: false, showUncheckAll: false,};
        this.accountDropDown.customText = {buttonDefaultText: 'None'};
        
		
		this.getDiscussionAccounts(request.id);
		this.getDiscussionEntries(request.id);
	}
	
	changeDiscussionStatus() {
		this.service.changeDiscussionStatus(this.request).then((promise) => {
			this.discussionStatus = this.request.discussion_status;
			promise.data.date_time_entered = this.updateTimestamp(promise.data.date_time_entered);
			this.discussionEntries.unshift(promise.data);
			this.modified = true;
		}, () =>{
			this.request.discussion_status = this.discussionStatus;
		});
	}
	
	updateTimestamp(ts) {
		let tmp =  ts;
		let tPos = tmp.indexOf('T');
		let pPos = tmp.indexOf('.');
		ts = tmp.substring(0,tPos) + ' ' + tmp.substring(tPos+1,pPos);
		return ts;
		
	}
	
	getDiscussionEntries(id) {
		this.spinner.show("Retrieving discussion entries..."); 
		this.service.getDiscussion(id).then((promise) => {
			if (this.notifyAccounts !== null) {
				this.spinner.hide();
			}
			this.discussionEntries = promise.data.results;
			for (let discussIdx in this.discussionEntries) {
				this.discussionEntries[discussIdx].date_time_entered =
				this.updateTimestamp(this.discussionEntries[discussIdx].date_time_entered);
			}
		}, () => {
			if (this.discussionEntries !== null && this.notifyAccounts !== null) {
				this.spinner.hide();
			}
		});
	}
	
	getDiscussionAccounts(id) {
		this.service.getDiscussionAccounts(id).then((promise) => {
			if (this.discussionEntries !== null) {
				this.spinner.hide();
			}
			this.notifyAccounts = promise.data;
			for (let accountIdx in this.notifyAccounts) {
				this.accountDropDown.options.push({id: this.notifyAccounts[accountIdx].id, label: this.notifyAccounts[accountIdx].email});
			}
		}, () => {
			if (this.discussionEntries !== null && this.notifyAccounts !== null) {
				this.spinner.hide();
			}
		});
	}
	
	addEntry() {
		let notifyIds = [];
		for (let selectedIndex in this.accountDropDown.selectedOptions) {
			notifyIds.push(this.accountDropDown.selectedOptions[selectedIndex].id);
		}
		let newEntry = {
			request:this.request.id,
			author: this.userId,
			notify: notifyIds,
			text: this.discussionText,
		};
		this.spinner.show("Adding new entry..."); 
		this.service.postDiscussionEntry(newEntry).then((promise) => {
			this.spinner.hide();
			promise.data.date_time_entered = this.updateTimestamp(promise.data.date_time_entered);
			this.discussionEntries.unshift(promise.data);
			this.modified = true;
		}, () => {
			this.spinner.hide();
		});
	}
	
	checkClose() {
		if (this.modified) {
			this.close();
		} else {
			this.dismiss();
		}
	}
	
	close() {
        this.$uibModalInstance.close();
    }

    dismiss() {
        this.$uibModalInstance.dismiss();
    }
}