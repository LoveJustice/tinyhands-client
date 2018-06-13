export default class StaffService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getStaff() {
        return {
            then: f => f({
                data: [{
                        "id": 24,
                        "email": "",
                        "first_name": "Frank",
                        "last_name": "Hardy",
                        "phone": "9993214563",
                        "position": "Safety / Paralegal Coordinator",
                        "receives_money_distribution_form": false,
                        "border_station": 2
                    },
                    {
                        "id": 25,
                        "email": "nancy_drew@yahoo.com",
                        "first_name": "Nancy",
                        "last_name": "Drew",
                        "phone": "99984613240",
                        "position": "Station Manager / Data Coordinator",
                        "receives_money_distribution_form": false,
                        "border_station": 2
                    },
                    {
                        "id": 26,
                        "email": "",
                        "first_name": "Sherlock",
                        "last_name": "Holmes",
                        "phone": "9996228266",
                        "position": "Admin / Accounting Coordinator",
                        "receives_money_distribution_form": false,
                        "border_station": 2
                    },
                    {
                        "id": 29,
                        "email": "",
                        "first_name": "Hercule",
                        "last_name": "Poirot",
                        "phone": "9991031633",
                        "position": "Legal Advisor",
                        "receives_money_distribution_form": false,
                        "border_station": 2
                    }
                ]
            })
        };
    }
}