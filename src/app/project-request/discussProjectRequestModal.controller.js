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
		this.discussionEntries = [];
		this.notifyAccounts = [];
		
		this.getDiscussionEntries(request.id);
		this.getDiscussionAccounts(request.id);
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
			this.spinner.hide();
			this.discussionEntries = promise.data.results;
			for (let discussIdx in this.discussionEntries) {
				this.discussionEntries[discussIdx].date_time_entered =
				this.updateTimestamp(this.discussionEntries[discussIdx].date_time_entered);
			}
		}, () => {this.spinner.hide();});
	}
	
	getDiscussionAccounts(id) {
		this.service.getDiscussionAccounts(id).then((promise) => {
			this.notifyAccounts = promise.data;
		}, () => {});
	}
	
	addEntry() {
		let notifyId = null;
		if (this.notifyAccount !== '') {
			let index = Number(this.notifyAccount);
			notifyId = this.notifyAccounts[index].id;
		}
		let newEntry = {
			request:this.request.id,
			author: this.userId,
			notify: notifyId,
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