import './help.less';

export default class ViewVideoController {
    constructor(helpService, $stateParams) {
        'ngInject';
        
        this.service = helpService;
        this.stateParams = $stateParams;
        this.videoUrl = this.stateParams.videoUrl
        this.getEmbededUrl();
    }
    
    getEmbededUrl() {       
        this.service.getEmbededUrl(this.videoUrl).then( (promise) => {
            this.embeddedUrl = promise.data.html.replace(/\\"/gi, '"');  
            $('#videoDiv').append(this.embeddedUrl);
        }, (error) => {
        	alert("Unable to load video");
           });
    }
}
