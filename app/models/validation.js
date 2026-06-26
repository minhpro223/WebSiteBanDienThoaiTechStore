function getId(id) {
  return document.getElementById(id);
}
class Validation {
  checkEmpty(value, divId, mess) {
    if (value.trim() === "") {
      getId(divId).innerHTML = mess;
      getId(divId).style.display = "block";
      return false;
    }
    getId(divId).innerHTML = "";
    getId(divId).style.display = "none";
    return true;
  }
  checkName(value, divId, mess) {
    const namePattern = /^[A-Za-zÀ-ỹ0-9\s\-()]+$/;
    if (namePattern.test(value)) {
      getId(divId).innerHTML = "";
      getId(divId).style.display = "none";
      return true;
    }
    getId(divId).innerHTML = mess;
    getId(divId).style.display = "block";
    return false;
  }
  checkImage(value, divId, message) {
    const imagePattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i;

    if (imagePattern.test(value.trim())) {
      getId(divId).innerHTML = "";
      getId(divId).style.display = "none";
      return true;
    }

    getId(divId).innerHTML = message;
    getId(divId).style.display = "block";
    return false;
  }
  checkPrice(value, divId, message) {
    if (isNaN(value) || Number(value) <= 0) {
      getId(divId).innerHTML = message;
      getId(divId).style.display = "block";
      return false;
    }

    getId(divId).innerHTML = "";
    getId(divId).style.display = "none";
    return true;
  }
}
export default Validation;
