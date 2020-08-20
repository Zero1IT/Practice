import {View} from "./View";
import {LoginDto} from "../models/dto/LoginDto";
import {RegistrationDto} from "../models/dto/RegistrationDto";
import {app} from "../app";

class SignView extends View {

    /**
     * @param {HTMLElement|View} parent - content container
     * @param {Object=} model - view model
     */
    constructor(parent = null, model = undefined) {
        super(parent);
        this.model = model;
    }

    async render() {
        await this._render(`
            <div class="login-wrap">
                <div class="login-html">
                    <input id="tab-1" type="radio" name="tab" class="sign-in" checked><label for="tab-1" class="tab">Sign In</label>
                    <input id="tab-2" type="radio" name="tab" class="sign-up"><label for="tab-2" class="tab">Sign Up</label>
                    <div class="login-form">
                        <div class="sign-in-htm">
                            <div class="group">
                                <label for="s_email" class="group-label">Email</label>
                                <input id="s_email" type="text" class="form-input">
                                <span class="error-highlight"></span>
                            </div>
                            <div class="group">
                                <label for="s_pass" class="group-label">Password</label>
                                <input id="s_pass" type="password" class="form-input" data-type="password">
                                <span class="error-highlight"></span>
                            </div>
                            <div class="group">
                                <input id="s_check" type="checkbox" class="check" checked>
                                <label for="s_check"><span class="icon"></span> Keep me Signed in</label>
                            </div>
                            <div class="group">
                                <input type="submit" class="accept-form-button" value="Sign In">
                            </div>
                            <div class="hr"></div>
                            <div class="foot-lnk">
                                <a href="#">Forgot Password?</a>
                            </div>
                        </div>
                        <div class="sign-up-htm">
                            <div class="group">
                                <label for="username" class="group-label">Username</label>
                                <input id="username" type="text" class="form-input">
                                <span class="error-highlight"></span>
                            </div>
                            <div class="group">
                                <label for="email" class="group-label">Email Address</label>
                                <input id="email" type="text" class="form-input">
                                <span class="error-highlight"></span>
                            </div>
                            <div class="group">
                                <label for="phone" class="group-label">Full phone number</label>
                                <input id="phone" type="text" class="form-input">
                                <span class="error-highlight"></span>
                            </div>
                            <div class="group">
                                <label for="pass" class="group-label">Password</label>
                                <input id="pass" type="password" class="form-input" data-type="password">
                                <span class="error-highlight"></span>
                            </div>
                            <div class="group">
                                <label for="repeat" class="group-label">Repeat Password</label>
                                <input id="repeat" type="password" class="form-input" data-type="password">
                                <span class="error-highlight"></span>
                            </div>
                            <div class="group">
                                <input type="submit" class="accept-form-button" value="Sign Up">
                            </div>
                            <div class="hr"></div>
                            <div class="foot-lnk">
                                <a href="#">Already Member?</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`);
        this.setEvents();
        return this.container;
    }

    /**
     * @return {HTMLElement}
     */
    setEvents() {
        this.registrationPasswordLiveValidator();
        this.usernameLiveValidator(this.getHtmlElement("#username"));
        this.emailLiveValidator(this.getHtmlElement("#email"));
        this.phoneLiveValidator(this.getHtmlElement("#phone"));
        this.passwordLiveValidator(this.getHtmlElement("#s_pass"));
        this.emailLiveValidator(this.getHtmlElement("#s_email"));

        let signs = document.getElementsByClassName("accept-form-button");
        signs[0].addEventListener("click", e => {
            this.callHandler(EVENT.SIGN_IN, this.signInData(), signs[0], e);
        });
        signs[1].addEventListener("click", e => {
            this.callHandler(EVENT.SIGN_UP, this.signUpData(), signs[1], e);
        });
        return this.container;
    }

    callHandler(type, data, button, e) {
        if (data) {
            this.handler.handle(type, {
                model: data,
                event: e
            }).catch(e => alert(e.message)); // TODO: show error
        } else {
            let color = button.style.backgroundColor;
            button.disabled = true;
            button.style.backgroundColor = "red";
            setTimeout(() =>  {
                button.style.backgroundColor = color;
                button.disabled = false;
            }, 2000);
        }
    }

    signInData() {
        try {
            let dto = new LoginDto();
            dto.password = this.getHtmlElement("#s_pass").value;
            dto.email = this.getHtmlElement("#s_email").value;
            dto.remember = this.getHtmlElement("#s_check").checked;
            return dto.isValid() ? dto : null;
        } catch (e) {
            console.error(e);
        }
    }

    signUpData() {
        try {
            let dto = new RegistrationDto();
            dto.password = this.getHtmlElement("#pass").value;
            dto.repeatedPassword = this.getHtmlElement("#repeat").value;
            dto.username = this.getHtmlElement("#username").value;
            dto.email = this.getHtmlElement("#email").value;
            dto.phone = this.getHtmlElement("#phone").value;
            return dto.isValid() ? dto : null;
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Synchronized inputs for password and for its repeated input
     */
    registrationPasswordLiveValidator() {
        let passInput = this.getHtmlElement("#pass");
        passInput.addEventListener("input", validator);
        let repeatPassInput = this.getHtmlElement("#repeat");
        repeatPassInput.addEventListener("input", validator);
        function validator() {
            if (!app.validator.isValidPassword(passInput.value)) {
                passInput.nextElementSibling.innerText = app.values.incorrect.password;
            } else {
                passInput.nextElementSibling.innerText = "";
            }
            if (passInput.value !== repeatPassInput.value) {
                repeatPassInput.nextElementSibling.innerText = app.values.incorrect.repeated_password;
            } else {
                repeatPassInput.nextElementSibling.innerText = "";
            }
        }
    }

    /**
     * @param input - html element <input />
     * @return input
     */
    usernameLiveValidator(input) {
        this.setupLiveValidator(input, app.values.incorrect.username,
                str => app.validator.isValidUsername(str))
    }

    /**
     * @param input - html element <input />
     * @return input
     */
    passwordLiveValidator(input) {
        this.setupLiveValidator(input, app.values.incorrect.password,
                str => app.validator.isValidPassword(str))
    }

    /**
     * @param input - html element <input />
     * @return input
     */
    emailLiveValidator(input) {
        this.setupLiveValidator(input, app.values.incorrect.email,
                str => app.validator.isValidEmail(str))
    }

    /**
     * @param input - html element <input />
     * @return input
     */
    phoneLiveValidator(input) {
        this.setupLiveValidator(input, app.values.incorrect.phone,
                str => app.validator.isValidPhoneNumber(str))
    }

    /**
     * Predicate function with one parameter
     * @param item {*}
     * @return {boolean}
     * @callback predicateFunc
     */

    /**
     * Setup listener for input
     * @param input - html element <input />
     * @param errorMessage {String} - error message, tip for user
     * @param predicate {predicateFunc}
     * @return input
     */
    setupLiveValidator(input, errorMessage, predicate) {
        input.addEventListener("input", _ => {
            if (!predicate(input.value)) {
                input.nextElementSibling.innerText = errorMessage;
            } else {
                input.nextElementSibling.innerText = "";
            }
        });
        return input;
    }
}

const EVENT = {
    SIGN_UP: "up",
    SIGN_IN: "in"
};

export {
    EVENT,
    SignView
}