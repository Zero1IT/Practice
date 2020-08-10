import {app} from "../../app";

export class LoginDto {

    constructor() {
        this._email = undefined;
        this._password = undefined;
        this._remember = undefined;
    }

    get email() {
        return this._email;
    }

    set email(value) {
        this._email = value;
    }

    get password() {
        return this._password;
    }

    set password(value) {
        this._password = value;
    }

    get remember() {
        return this._remember;
    }

    set remember(value) {
        this._remember = value;
    }

    isValid() {
        return  app.validator.isValidPassword(this.password) &&
                app.validator.isValidEmail(this.email);
    }

    toJson() {
        return JSON.stringify({
            email: this.email,
            password: this.password
        });
    }
}