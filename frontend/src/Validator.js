export class Validator {

    constructor() {
        this.passwordReg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$!%_*#?&]{8,}$/;
        this.emailReg = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;
        this.phoneReg = /^\+?\d{4,5}\d{7,8}$/;
        this.usernameReg = /^[^0-9_][\w_]{4,32}$/i;
    }

    isValidPassword(password) {
        return this.passwordReg.test(password);
    }

    isValidEmail(email) {
        return this.emailReg.test(email);
    }

    isValidPhoneNumber(phone) {
        return this.phoneReg.test(phone);
    }

    isValidUsername(username) {
        return this.usernameReg.test(username);
    }
}