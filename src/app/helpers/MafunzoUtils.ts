export default class Utils {
  static formatPhoneNumber(phoneNumber) {
    return phoneNumber.replace(/^0/, "");
  }

  //a function that generates the current time in milliseconds
  static getCurrentTime() {
    return new Date().getTime();
  }

  //save user id
  static saveUserId(uid: string) {
    localStorage.setItem("uid", uid);
  }

  //get user id
  static getUserId() {
    return localStorage.getItem("uid");
  }
}
