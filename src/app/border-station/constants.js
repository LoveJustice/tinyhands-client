const Constants = {
	Events: {
		Create: {
			BorderStation: {
				Done: 'Create.BorderStation.Done',
				Error: 'Create.BorderStation.Error',
				Start: 'Create.BorderStation'
			}
		},
		Get: {
			BorderStation: 'Get.BorderStation'
		},
		Update: {
			BorderStation: 'Update.BorderStation',
			Detail: {
				Done: 'Update.Detail.Done',
				Error: 'Update.Detail.Error'
			},
			Location: {
				Done: 'Update.Location.Done',
				Error: 'Update.Location.Error'
			},
			People: {
				Done: 'Update.People.Done',
				Error: 'Update.People.Error'
			}
		}
	},
	UpdateButtonText: {
		Create: 'Create Station',
		Default: 'Update Station',
		Error: 'Error',
		Saved: 'Saved',
		Saving: 'Saving...'
	}
};
export default Constants;