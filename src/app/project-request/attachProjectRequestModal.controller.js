// global location

export default class DiscussProjectRequestModalController{
	constructor($uibModalInstance, SpinnerOverlayService, $scope, service, request) {
		this.$uibModalInstance = $uibModalInstance;
		this.spinner = SpinnerOverlayService;
		this.$scope = $scope;
		this.service = service;
		this.request = request;
		
		this.attachmentEntries = [];
		
		this.attachment = {
			id: null,
			request: this.request.id,
		    description: '',
		    option: '',
		    attachment: null  
		};
		
		this.getAttachments(request.id);
	}
	
	getAttachments(id) {
		this.spinner.show("Retrieving attachment entries..."); 
		this.service.getAttachment(id).then((promise) => {
			this.spinner.hide();
			this.attachmentEntries = promise.data.results;
		}, () => {this.spinner.hide();});
	}
	
	addEntry() {
		this.spinner.show("Adding new entry..."); 
		this.service.postAttachment(this.attachment).then((promise) => {
			this.spinner.hide();
			this.attachmentEntries.unshift(promise.data);
			this.attachmentEntries[0].attachment = 'http://' + location.hostname + this.attachmentEntries[0].attachment;
			this.attachment = {
				id: null,
				request: this.request.id,
			    description: '',
			    option: '',
			    attachment: null  
			};
		}, () => {
			this.spinner.hide();
		});
	}
	
	deleteAttachment(attachment, index) {
        if (attachment.confirmedDelete) {
            this.service.deleteAttachment(attachment.id).then(
                () => {
                    this.attachmentEntries.splice(index, 1);
                }, (error) => {alert(error);}
            );
        } else {
            attachment.confirmedDelete = true;
        }
    }
	
	lastPath(path) {
		let pathParts = path.split('/');
		return pathParts[pathParts.length - 1];
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