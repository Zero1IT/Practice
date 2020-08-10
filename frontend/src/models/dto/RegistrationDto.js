import {app} from "../../app";

export class RegistrationDto {

    constructor() {
        this._username = undefined;
        this._email = undefined;
        this._phone = undefined;
        this._password = undefined;
        this._repeatedPassword = undefined;
    }

    get username() {
        return this._username;
    }

    set username(value) {
        this._username = value;
    }

    get email() {
        return this._email;
    }

    set email(value) {
        this._email = value;
    }

    get phone() {
        return this._phone;
    }

    set phone(value) {
        this._phone = value;
    }

    get password() {
        return this._password;
    }

    set password(value) {
        this._password = value;
    }


    get repeatedPassword() {
        return this._repeatedPassword;
    }

    set repeatedPassword(value) {
        this._repeatedPassword = value;
    }

    isValid() {
        return  app.validator.isValidEmail(this.email) &&
                app.validator.isValidPassword(this.password) &&
                app.validator.isValidUsername(this.username) &&
                this.password === this.repeatedPassword;
    }

    toJson() {
        return JSON.stringify({
            username: this.username,
            email: this.email,
            phone: this.phone,
            password: this.password
        });
    }
}