import { angular2react } from 'angular2react'
import PhotoExportComponent from "./photo-export.component";

const PhotoExportReact = angular2react('photoexportComponent', PhotoExportComponent, $injector)

export default PhotoExportReact