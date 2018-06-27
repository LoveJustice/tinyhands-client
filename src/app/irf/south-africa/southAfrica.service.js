export default class SouthAfricaService {
    constructor(BaseService) {
        "ngInject";
        this.service = BaseService;
    }

    getSouthAfricaIrf() {
        return {
            then: f =>
                f({
                    data: {
                        station_id: 32,
                        country_id: 4,
                        status: "approved",
                        storage_id: 4,
                        responses: [
                            {
                                question_id: 1,
                                storage_id: 4,
                                response: {
                                    value: "MBZ950"
                                }
                            },
                            {
                                question_id: 2,
                                storage_id: 4,
                                response: {
                                    value: 1
                                }
                            },
                            {
                                question_id: 3,
                                storage_id: 4,
                                response: {
                                    value: {
                                        id: 52,
                                        name: "Barmeli Chowak"
                                    }
                                }
                            },
                            {
                                question_id: 4,
                                storage_id: 4,
                                response: {
                                    value: "2017-04-23T19:45:00+05:45"
                                }
                            },
                            {
                                question_id: 5,
                                storage_id: 4,
                                response: {
                                    value: 1
                                }
                            },
                            {
                                question_id: 6,
                                storage_id: 4,
                                response: {
                                    value: [
                                        {
                                            id: 1,
                                            name: "John Staff"
                                        }
                                    ]
                                }
                            },
                            {
                                question_id: 10,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 12,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 13,
                                storage_id: 4,
                                response: {
                                    value: true
                                }
                            },
                            {
                                question_id: 14,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 21,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 22,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 23,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 24,
                                storage_id: 4,
                                response: {
                                    value: true
                                }
                            },
                            {
                                question_id: 25,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 26,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 27,
                                storage_id: 4,
                                response: {
                                    value: true
                                }
                            },
                            {
                                question_id: 28,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 30,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 31,
                                storage_id: 4,
                                response: {
                                    value: "Other Text"
                                }
                            },
                            {
                                question_id: 36,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 37,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 38,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 39,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 41,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 51,
                                storage_id: 4,
                                response: {
                                    value: true
                                }
                            },
                            {
                                question_id: 52,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 53,
                                storage_id: 4,
                                response: {
                                    value: true
                                }
                            },
                            {
                                question_id: 54,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 55,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 56,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 57,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 58,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 59,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 60,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 61,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 62,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 63,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 64,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 69,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 70,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 73,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 74,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 77,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 78,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 79,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 80,
                                storage_id: 4,
                                response: {
                                    value: true
                                }
                            },
                            {
                                question_id: 81,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 82,
                                storage_id: 4,
                                response: {
                                    value: "Own brother"
                                }
                            },
                            {
                                question_id: 91,
                                storage_id: 4,
                                response: {
                                    value: "Staff"
                                }
                            },
                            {
                                question_id: 92,
                                storage_id: 4,
                                response: {
                                    value: ""
                                }
                            },
                            {
                                question_id: 102,
                                storage_id: 4,
                                response: {
                                    value: null
                                }
                            },
                            {
                                question_id: 104,
                                storage_id: 4,
                                response: {
                                    value: ""
                                }
                            },
                            {
                                question_id: 106,
                                storage_id: 4,
                                response: {
                                    value: [
                                        {
                                            id: 2,
                                            name: "Staff Member"
                                        }
                                    ]
                                }
                            },
                            {
                                question_id: 111,
                                storage_id: 4,
                                response: {
                                    value: true
                                }
                            },
                            {
                                question_id: 112,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 113,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 114,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 115,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 116,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 117,
                                storage_id: 4,
                                response: {
                                    value: true
                                }
                            },
                            {
                                question_id: 118,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 119,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 120,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 121,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 122,
                                storage_id: 4,
                                response: {
                                    value: true
                                }
                            },
                            {
                                question_id: 123,
                                storage_id: 4,
                                response: {
                                    value: true
                                }
                            },
                            {
                                question_id: 124,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 125,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 126,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 127,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 128,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 129,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 130,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 131,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 132,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 133,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 134,
                                storage_id: 4,
                                response: {
                                    value: "Other text"
                                }
                            },
                            {
                                question_id: 141,
                                storage_id: 4,
                                response: {
                                    value: "Sex Trafficking"
                                }
                            },
                            {
                                question_id: 143,
                                storage_id: 4,
                                response: {
                                    value: 160
                                }
                            },
                            {
                                question_id: 144,
                                storage_id: 4,
                                response: {
                                    value: 165
                                }
                            },
                            {
                                question_id: 146,
                                storage_id: 4,
                                response: {
                                    value: ""
                                }
                            },
                            {
                                question_id: 147,
                                storage_id: 4,
                                response: {
                                    value: "4 - Very sure"
                                }
                            },
                            {
                                question_id: 148,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 149,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 150,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 151,
                                storage_id: 4,
                                response: {
                                    value: true
                                }
                            },
                            {
                                question_id: 152,
                                storage_id: 4,
                                response: {
                                    value:
                                        "/media/scanned_irf_forms/sample_360dpi.pdf"
                                }
                            },
                            {
                                question_id: 242,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 243,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 244,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 245,
                                storage_id: 4,
                                response: {
                                    value: ""
                                }
                            },
                            {
                                question_id: 246,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 247,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 248,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 249,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 251,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 252,
                                storage_id: 4,
                                response: {
                                    value: true
                                }
                            },
                            {
                                question_id: 253,
                                storage_id: 4,
                                response: {
                                    value: true
                                }
                            },
                            {
                                question_id: 254,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 255,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            },
                            {
                                question_id: 256,
                                storage_id: 4,
                                response: {
                                    value: false
                                }
                            }
                        ],
                        cards: [
                            {
                                category_id: 6,
                                instances: [
                                    {
                                        responses: [
                                            {
                                                question_id: 7,
                                                response: {
                                                    value:
                                                        "/media/interceptee_photos/jellyfish.jpg"
                                                }
                                            },
                                            {
                                                question_id: 8,
                                                response: {
                                                    value: "PVOT"
                                                }
                                            },
                                            {
                                                question_id: 9,
                                                response: {
                                                    name: {
                                                        value: "Jane Doe"
                                                    },
                                                    address1: {
                                                        id: 301,
                                                        name: "Kathmandu"
                                                    },
                                                    address2: {
                                                        id: 7475,
                                                        name: "Gonggabu"
                                                    },
                                                    phone: {
                                                        value: "9815555555"
                                                    },
                                                    gender: {
                                                        value: "Female"
                                                    },
                                                    birthdate: {
                                                        value: "1998-07-01"
                                                    },
                                                    passport: {
                                                        value: "12345678"
                                                    },
                                                    nationality: {
                                                        value: "Himalayan"
                                                    }
                                                }
                                            },
                                            {
                                                question_id: 11,
                                                response: {
                                                    value: false
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                })
        };
    }
}
