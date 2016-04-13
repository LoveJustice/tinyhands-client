export default class UtilService {
  validId(id) {
    if (typeof id !== undefined && parseInt(id) >= 0) {
      return true;
    }
    return false;
  }
}