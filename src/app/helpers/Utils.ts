import { HttpHeaders } from "@angular/common/http";

export default class Utils {
  static formatPhoneNumber(phoneNumber) {
    return phoneNumber.replace(/^0/, "");
  }

  //a function that generates the current time in milliseconds
  static getCurrentTime() {
    return new Date().getTime();
  }
}
