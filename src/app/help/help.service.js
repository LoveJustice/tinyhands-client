export default class HelpService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getHelpVideos(queryParameters) {
        return this.service.get('api/help/video/', queryParameters);
    }
    
    getMoreMonthlyReports(queryParameters) {
        return this.service.get('api/help/video/', queryParameters);
    }
    
    getEmbededUrl(url) {                 
        return this.service.$http.get("https://vimeo.com/api/oembed.json?url=" + url);
    }
}