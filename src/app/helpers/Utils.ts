import { HttpHeaders } from "@angular/common/http";

export default class Utils {
  static formatPhoneNumber(phoneNumber) {
    return phoneNumber.replace(/^0/, "");
  }
}
