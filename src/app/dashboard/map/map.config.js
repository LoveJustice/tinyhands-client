function GoogleMapsConfig(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyChNFPd_bOOnk59AkeKM862OqN80Lvp56g',
        v: '3.24',
        libraries: 'weather,geometry,visualization'
    });
}

export default GoogleMapsConfig;
