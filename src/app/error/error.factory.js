class ErrorService {
    constructor($q) {
        'ng-inject';

        this.q = $q;
    }

    responseError(rejection){
        if ([403, 404, 500].find(x => x === rejection.status)) {
            window.location = '/#/error/' + 403;
        }
        return this.q.reject(rejection);
    }

    static errorFactory($q){
        return new ErrorService($q);
    }
}

export default ErrorService;