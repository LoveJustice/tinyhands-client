const Constants = {
	MainPersonId:292,
	totalFlagId:451,
	
	Person:[292],
	Address:[],
	RadioOther:[305,339],
	Date:[288,479,375,386],
	RadioItems:{
		"289":[
        	['Intercept', 'Operation'],
        	['Victim', 'Police'],
        	['Trafficker', 'OSI'],
        ],
		"305":['Father', 'Mother', 'Uncle', 'Aunt', 'Brother', 'Sister',
        	'Other Relative', 'Friend', 'Agent', 'Boyfriend', 'Neighbor', 'Recently Met'],
		"339":['Delhi, Osi', 'Gorakhpur, Osi', 'Unknown location in Osi',
			'Unknown Gulf location', 'Kuwait', 'Dubai, UAE', "Don't Know"]
	},
	
	OtherPotentialVictims: {
		Category:40,
		Person: [300],
		Address:[],
		Basic:[301],
		Date:[],
		RadioOther:[],
		RadioItems:{},
	},
	Transportations: {
		Category:43,
		IndexQuestion:352,
		Person:[],
		Address:[],
		Basic:[351,352,487],
		Date:[353],
		RadioOther:[],
		RadioItems:{},
	},
	PersonBoxes: {
		Category:45,
		IndexQuestion:480,
		Person:[9],
		Address:[],
		Basic:[417,418,419,421,423,475,476,477,478,480,483,484,485,486],
		Date:[],
		RadioOther:[420,422,474],
		RadioItems:{
			9:['Osii','Osin'],
			420:['Broker', 'Companion', 'Host', 'ID Facilitator', 'Agent', 'Witness', 'Complainant'],
			422:['None', 'Recruitment Agent', 'Police', 'Army', 'Guard', 'Driver'],
			474:['Immediate Family', 'Friend', 'From Community', 'Met recently', 'Other Relative', 'Co-worker']
		}
	},
	LocationBoxes: {
		Category:46,
		IndexQuestion:481,
		Person:[],
		Address:[427],
		Basic:[424,428,429,430,431,432,433,434,435,436,438,439,440,441,442,443,444,445, 481, 489],
		Date:[437],
		RadioOther:[425,426],
		RadioItems:{
			"424":['Transit Location', 'Meet Point', 'Destination', 'Source of ID', 'Recruitment Agency'],
			"425":['House', 'Bus Station', 'Hotel', 'Train Station', 'Airport'],
			"426":['Osi', 'Osi']
		}
	},
	VehicleBoxes: {
		Category:47,
		IndexQuestion:482,
		Person:[],
		Address:[],
		Basic:[446,448,449,482],
		Date:[],
		RadioOther:[447],
		RadioItems:{
			447:['Private Car', 'Bus', 'Motorcycle', 'Truck', 'Van']
		}
	}
};
export default Constants;
