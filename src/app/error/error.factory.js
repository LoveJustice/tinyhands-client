class ErrorFactory {
    constructor($q) {
        'ngInject';

        this.q = $q;
    }

    responseError(rejection){
        if ([403, 404, 500].find(x => x === rejection.status)) {
            window.location = '/error/' + rejection.status;
        }
        return this.q.reject(rejection);
    }

    static errorFactory($q){
        return new ErrorFactory($q);
    }
}

export default ErrorFactory;