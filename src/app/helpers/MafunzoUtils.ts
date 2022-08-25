export default class Utils {
  static defaultAnnouncementImage: string =
    "https://centennial.dsbn.org/images/default-source/Website-images/announcement_clip_art.jpg";

  static defaultAvatar: string =
    "https://firebasestorage.googleapis.com/v0/b/mafunzo-africa.appspot.com/o/images%2Fdefault_avatar.jpg?alt=media&token=5d9f5b77-65b2-4828-87a7-1f7082dec5bb";
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

  //a function that takes a date and time and returns it in milliseconds
  static getDateTimeInMilliseconds(date: string, time: string) {
    const dateTime = new Date(date + " " + time);
    return dateTime.getTime();
  }

  static getDateTimeInMilliseconds2(date: string) {
    const dateTime = new Date(date);
    return dateTime.getTime();
  }

  //takes time in milliseconds and returns it in Date format
  static getDateFromMilliseconds(milliseconds: number) {
    return new Date(milliseconds);
  }
}
