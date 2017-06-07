export default class FileDownloaderService {
    constructor(FileSaver, Blob) {
        this.fileSaver = FileSaver;
        this.blob = Blob;
    }

    static get FILE_TYPE_CSV() { return 'text/csv'; }

    downloadFileAs(fileData, fileName, fileType) {
        let dataArray = Array.isArray(fileData) ? fileData : [fileData];
        let data = new this.blob(dataArray, {type: fileType});
        this.fileSaver.saveAs(data, fileName);
    }
}