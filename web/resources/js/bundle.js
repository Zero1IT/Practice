/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./Fetcher.js":
/*!********************!*\
  !*** ./Fetcher.js ***!
  \********************/
/*! exports provided: Fetcher */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Fetcher\", function() { return Fetcher; });\n/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app */ \"./app.js\");\n\r\n\r\nclass Fetcher {\r\n    /**\r\n     * @return Promise<Response> - fetch() promise\r\n     */\r\n    jsonRequest(url, method, jsonData) {\r\n        return fetch(url, {\r\n            method: method,\r\n            headers: {\r\n                \"Content-Type\": \"application/json;charset=utf-8\",\r\n                \"Authorization\": `Bearer ${_app__WEBPACK_IMPORTED_MODULE_0__[\"app\"].token}`\r\n            },\r\n            body: jsonData\r\n        });\r\n    }\r\n}\n\n//# sourceURL=webpack:///./Fetcher.js?");

/***/ }),

/***/ "./Router.js":
/*!*******************!*\
  !*** ./Router.js ***!
  \*******************/
/*! exports provided: Router */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Router\", function() { return Router; });\n\r\nclass Router {\r\n    /**\r\n     * Callback for handle url\r\n     * @callback notFoundCallback\r\n     * @param {String} path - not founded path\r\n     */\r\n\r\n    /**\r\n     * @param {{page404: notFoundCallback}=} options\r\n     */\r\n    constructor(options) {\r\n        this.urlMap = new Map();\r\n        this.options = options;\r\n    }\r\n\r\n    /**\r\n     * Callback for handle url\r\n     * @callback urlHandler\r\n     */\r\n\r\n    /**\r\n     * Add url handler to router\r\n     * @param {String} url - handled url\r\n     * @param {urlHandler} handler - callback function\r\n     */\r\n    add(url, handler) {\r\n        this.urlMap.set(url, handler);\r\n    }\r\n\r\n    /**\r\n     * Navigate to given url\r\n     * @param {String} url\r\n     * @param {Boolean=} silent - false for add to history otherwise true\r\n     */\r\n    navigateTo(url, silent= false) {\r\n        let handler = this.urlMap.get(url);\r\n        if (handler) {\r\n            if (!silent) {\r\n                history.pushState(null, null, url);\r\n            }\r\n            handler();\r\n        } else if (this.options && this.options.page404) {\r\n            this.options.page404(url);\r\n        } else {\r\n            alert(`Cannot handle navigate to ${url}`)\r\n        }\r\n    }\r\n\r\n    redirectTo(url) {\r\n        history.go(-10000);\r\n        this.navigateTo(url, true);\r\n    }\r\n\r\n    startListener() {\r\n        window.onpopstate = () => this.popstateBinder();\r\n    }\r\n\r\n    popstateBinder() {\r\n        this.navigateTo(window.location.pathname, true);\r\n    }\r\n}\n\n//# sourceURL=webpack:///./Router.js?");

/***/ }),

/***/ "./Validator.js":
/*!**********************!*\
  !*** ./Validator.js ***!
  \**********************/
/*! exports provided: Validator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Validator\", function() { return Validator; });\nclass Validator {\r\n\r\n    constructor() {\r\n        this.passwordReg = /^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%_*#?&])[A-Za-z\\d@$!%_*#?&]{8,}$/;\r\n        this.emailReg = /^([a-zA-Z0-9_\\-.]+)@([a-zA-Z0-9_\\-.]+)\\.([a-zA-Z]{2,5})$/;\r\n        this.phoneReg = /^\\+?\\d{4,5}\\d{7,8}$/;\r\n        this.usernameReg = /^[^0-9_][\\w_]{4,32}$/i;\r\n    }\r\n\r\n    isValidPassword(password) {\r\n        return this.passwordReg.test(password);\r\n    }\r\n\r\n    isValidEmail(email) {\r\n        return this.emailReg.test(email);\r\n    }\r\n\r\n    isValidPhoneNumber(phone) {\r\n        return this.phoneReg.test(phone);\r\n    }\r\n\r\n    isValidUsername(username) {\r\n        return this.usernameReg.test(username);\r\n    }\r\n}\n\n//# sourceURL=webpack:///./Validator.js?");

/***/ }),

/***/ "./app.js":
/*!****************!*\
  !*** ./app.js ***!
  \****************/
/*! exports provided: app */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"app\", function() { return app; });\n/* harmony import */ var _Router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Router */ \"./Router.js\");\n/* harmony import */ var _views_ErrorView__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./views/ErrorView */ \"./views/ErrorView.js\");\n/* harmony import */ var _views_SignView__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./views/SignView */ \"./views/SignView.js\");\n/* harmony import */ var _views_ContainerView__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./views/ContainerView */ \"./views/ContainerView.js\");\n/* harmony import */ var _models_PageError__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./models/PageError */ \"./models/PageError.js\");\n/* harmony import */ var _controllers_SignController__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./controllers/SignController */ \"./controllers/SignController.js\");\n/* harmony import */ var _Validator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Validator */ \"./Validator.js\");\n/* harmony import */ var _Fetcher__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Fetcher */ \"./Fetcher.js\");\n/* harmony import */ var _values_strings_en__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./values/strings.en */ \"./values/strings.en.json\");\nvar _values_strings_en__WEBPACK_IMPORTED_MODULE_8___namespace = /*#__PURE__*/__webpack_require__.t(/*! ./values/strings.en */ \"./values/strings.en.json\", 1);\n/* harmony import */ var _models_observable_Observable__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./models/observable/Observable */ \"./models/observable/Observable.js\");\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nconst root = document.getElementById(\"wrapper\");\r\n\r\nclass App {\r\n\r\n    constructor() {\r\n        this.isInitialized = false;\r\n        this.router = new _Router__WEBPACK_IMPORTED_MODULE_0__[\"Router\"]({\r\n            page404: page => {\r\n                new _views_ErrorView__WEBPACK_IMPORTED_MODULE_1__[\"ErrorView\"](new _views_ContainerView__WEBPACK_IMPORTED_MODULE_3__[\"ContainerView\"](root), _models_PageError__WEBPACK_IMPORTED_MODULE_4__[\"PageError\"].model404(page)).render();\r\n            }\r\n        });\r\n        this.validator = new _Validator__WEBPACK_IMPORTED_MODULE_6__[\"Validator\"]();\r\n        this.fetcher = new _Fetcher__WEBPACK_IMPORTED_MODULE_7__[\"Fetcher\"]();\r\n        this.values = _values_strings_en__WEBPACK_IMPORTED_MODULE_8__;\r\n        this.token = \"\";\r\n        this.tokenPayload = new _models_observable_Observable__WEBPACK_IMPORTED_MODULE_9__[\"Observable\"](null);\r\n    }\r\n\r\n    acceptJwtToken(token) {\r\n        this.token = token;\r\n        let payload = this.token.split(\".\")[1];\r\n        this.tokenPayload.replaceModel(JSON.parse(atob(payload)).sub); // sub - payload key, value is object from server\r\n    }\r\n\r\n    initializeApp() {\r\n        if (this.isInitialized) {\r\n            throw new Error(\"App has already initialized\");\r\n        }\r\n        this.isInitialized = true;\r\n        this.router.add(\"/\", () => {\r\n            new _views_ContainerView__WEBPACK_IMPORTED_MODULE_3__[\"ContainerView\"](root, this.tokenPayload).render();\r\n        });\r\n        this.router.add(\"/sign\", () => {\r\n            let sign = new _views_SignView__WEBPACK_IMPORTED_MODULE_2__[\"SignView\"](new _views_ContainerView__WEBPACK_IMPORTED_MODULE_3__[\"ContainerView\"](root, this.tokenPayload));\r\n            sign.setHandler(new _controllers_SignController__WEBPACK_IMPORTED_MODULE_5__[\"SignController\"]());\r\n            sign.render();\r\n        });\r\n        this.router.navigateTo(window.location.pathname, true);\r\n        this.router.startListener();\r\n\r\n        document.body.addEventListener(\"click\", e => {\r\n            if (e.target.tagName === \"A\") {\r\n                e.preventDefault();\r\n                const href = e.target.getAttribute(\"href\");\r\n                this.router.navigateTo(href);\r\n            }\r\n        });\r\n    }\r\n}\r\n\r\nconst app = new App();\r\napp.initializeApp();\r\n\r\n\n\n//# sourceURL=webpack:///./app.js?");

/***/ }),

/***/ "./controllers/SignController.js":
/*!***************************************!*\
  !*** ./controllers/SignController.js ***!
  \***************************************/
/*! exports provided: SignController */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"SignController\", function() { return SignController; });\n/* harmony import */ var _ViewEvent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ViewEvent */ \"./controllers/ViewEvent.js\");\n/* harmony import */ var _views_SignView__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../views/SignView */ \"./views/SignView.js\");\n/* harmony import */ var _models_dto_LoginDto__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/dto/LoginDto */ \"./models/dto/LoginDto.js\");\n/* harmony import */ var _models_dto_RegistrationDto__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../models/dto/RegistrationDto */ \"./models/dto/RegistrationDto.js\");\n/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../app */ \"./app.js\");\n\r\n\r\n\r\n\r\n\r\n\r\nclass SignController extends _ViewEvent__WEBPACK_IMPORTED_MODULE_0__[\"ViewEvent\"] {\r\n\r\n    async handle(eventType, data) {\r\n        switch (eventType) {\r\n            case _views_SignView__WEBPACK_IMPORTED_MODULE_1__[\"EVENT\"].SIGN_IN:\r\n                await this.signIn(data);\r\n                break;\r\n            case _views_SignView__WEBPACK_IMPORTED_MODULE_1__[\"EVENT\"].SIGN_UP:\r\n                await this.signUp(data);\r\n                break;\r\n        }\r\n    }\r\n\r\n    /**\r\n     * @param data {{event: EventListener, model: LoginDto}}\r\n     * @return {Promise<void>}\r\n     */\r\n    async signIn(data) {\r\n        let response = await _app__WEBPACK_IMPORTED_MODULE_4__[\"app\"].fetcher.jsonRequest(\"/login\", \"POST\", data.model.toJson());\r\n        if (response.ok) {\r\n            \r\n        }\r\n    }\r\n\r\n    /**\r\n     * @param data {{event: EventListener, model: RegistrationDto}}\r\n     * @return {Promise<void>}\r\n     */\r\n    async signUp(data) {\r\n        let response = await _app__WEBPACK_IMPORTED_MODULE_4__[\"app\"].fetcher.jsonRequest(\"/registration\", \"POST\", data.model.toJson());\r\n        if (response.ok) {\r\n            let json = await response.json();\r\n            _app__WEBPACK_IMPORTED_MODULE_4__[\"app\"].acceptJwtToken(json.sign);\r\n        } else {\r\n            throw new Error(`${response.status}`);\r\n        }\r\n    }\r\n}\n\n//# sourceURL=webpack:///./controllers/SignController.js?");

/***/ }),

/***/ "./controllers/ViewEvent.js":
/*!**********************************!*\
  !*** ./controllers/ViewEvent.js ***!
  \**********************************/
/*! exports provided: ViewEvent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ViewEvent\", function() { return ViewEvent; });\nclass ViewEvent {\r\n\r\n    async handle(eventType, data = null) {\r\n        throw new Error(\"Handler isn't support\");\r\n    }\r\n}\n\n//# sourceURL=webpack:///./controllers/ViewEvent.js?");

/***/ }),

/***/ "./models/PageError.js":
/*!*****************************!*\
  !*** ./models/PageError.js ***!
  \*****************************/
/*! exports provided: PageError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"PageError\", function() { return PageError; });\nclass PageError {\r\n\r\n    /**\r\n     * @param {Number|String} code - status code\r\n     * @param {String} message - error message\r\n     * @param {String} describe - error info\r\n     */\r\n    constructor(code, message, describe) {\r\n        this.code = code;\r\n        this.message = message;\r\n        this.describe = describe;\r\n    }\r\n\r\n    static model404(page = \"page\") {\r\n        let code = 404;\r\n        let message = \"Page not found\";\r\n        let info = `The ${page} you are looking for might have been removed had its name changed or is temporarily unavailable.`;\r\n        return new PageError(code, message, info);\r\n    }\r\n}\n\n//# sourceURL=webpack:///./models/PageError.js?");

/***/ }),

/***/ "./models/dto/LoginDto.js":
/*!********************************!*\
  !*** ./models/dto/LoginDto.js ***!
  \********************************/
/*! exports provided: LoginDto */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"LoginDto\", function() { return LoginDto; });\n/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../app */ \"./app.js\");\n\r\n\r\nclass LoginDto {\r\n\r\n    constructor() {\r\n        this._email = undefined;\r\n        this._password = undefined;\r\n        this._remember = undefined;\r\n    }\r\n\r\n    get email() {\r\n        return this._email;\r\n    }\r\n\r\n    set email(value) {\r\n        this._email = value;\r\n    }\r\n\r\n    get password() {\r\n        return this._password;\r\n    }\r\n\r\n    set password(value) {\r\n        this._password = value;\r\n    }\r\n\r\n    get remember() {\r\n        return this._remember;\r\n    }\r\n\r\n    set remember(value) {\r\n        this._remember = value;\r\n    }\r\n\r\n    isValid() {\r\n        return  _app__WEBPACK_IMPORTED_MODULE_0__[\"app\"].validator.isValidPassword(this.password) &&\r\n                _app__WEBPACK_IMPORTED_MODULE_0__[\"app\"].validator.isValidEmail(this.email);\r\n    }\r\n\r\n    toJson() {\r\n        return JSON.stringify({\r\n            email: this.email,\r\n            password: this.password\r\n        });\r\n    }\r\n}\n\n//# sourceURL=webpack:///./models/dto/LoginDto.js?");

/***/ }),

/***/ "./models/dto/RegistrationDto.js":
/*!***************************************!*\
  !*** ./models/dto/RegistrationDto.js ***!
  \***************************************/
/*! exports provided: RegistrationDto */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RegistrationDto\", function() { return RegistrationDto; });\n/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../app */ \"./app.js\");\n\r\n\r\nclass RegistrationDto {\r\n\r\n    constructor() {\r\n        this._username = undefined;\r\n        this._email = undefined;\r\n        this._phone = undefined;\r\n        this._password = undefined;\r\n        this._repeatedPassword = undefined;\r\n    }\r\n\r\n    get username() {\r\n        return this._username;\r\n    }\r\n\r\n    set username(value) {\r\n        this._username = value;\r\n    }\r\n\r\n    get email() {\r\n        return this._email;\r\n    }\r\n\r\n    set email(value) {\r\n        this._email = value;\r\n    }\r\n\r\n    get phone() {\r\n        return this._phone;\r\n    }\r\n\r\n    set phone(value) {\r\n        this._phone = value;\r\n    }\r\n\r\n    get password() {\r\n        return this._password;\r\n    }\r\n\r\n    set password(value) {\r\n        this._password = value;\r\n    }\r\n\r\n\r\n    get repeatedPassword() {\r\n        return this._repeatedPassword;\r\n    }\r\n\r\n    set repeatedPassword(value) {\r\n        this._repeatedPassword = value;\r\n    }\r\n\r\n    isValid() {\r\n        return  _app__WEBPACK_IMPORTED_MODULE_0__[\"app\"].validator.isValidEmail(this.email) &&\r\n                _app__WEBPACK_IMPORTED_MODULE_0__[\"app\"].validator.isValidPassword(this.password) &&\r\n                _app__WEBPACK_IMPORTED_MODULE_0__[\"app\"].validator.isValidUsername(this.username) &&\r\n                this.password === this.repeatedPassword;\r\n    }\r\n\r\n    toJson() {\r\n        return JSON.stringify({\r\n            username: this.username,\r\n            email: this.email,\r\n            phone: this.phone,\r\n            password: this.password\r\n        });\r\n    }\r\n}\n\n//# sourceURL=webpack:///./models/dto/RegistrationDto.js?");

/***/ }),

/***/ "./models/observable/Observable.js":
/*!*****************************************!*\
  !*** ./models/observable/Observable.js ***!
  \*****************************************/
/*! exports provided: Observable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Observable\", function() { return Observable; });\n/**\r\n * Observer should implement async notify(model) method\r\n */\r\nclass Observable {\r\n\r\n    constructor(model) {\r\n        this.subscribers = new Set();\r\n        this.model = model;\r\n    }\r\n\r\n    /**\r\n     * Callback for change model\r\n     * @param model\r\n     * @callback callModel\r\n     */\r\n\r\n    /**\r\n     * Change model and notify all\r\n     * @param callback {callModel}\r\n     */\r\n    changeModel(callback) {\r\n        new Promise(resolve => {\r\n            callback(this.model);\r\n            resolve(this.model);\r\n        }).then(model => {\r\n            this.notifyAll(model);\r\n        });\r\n    }\r\n\r\n    notifyAll(model) {\r\n        for (let subscriber of this.subscribers) {\r\n            subscriber.notify(model).catch(console.log); // TODO: error handler\r\n        }\r\n    }\r\n\r\n    replaceModel(newModel) {\r\n        this.model = newModel;\r\n        this.notifyAll(this.model);\r\n    }\r\n\r\n    /**\r\n     * @return {boolean} - true if model present, otherwise false\r\n     */\r\n    isPresent() {\r\n        return !!this.model;\r\n    }\r\n\r\n    /**\r\n     * Return copy of observable model\r\n     * @return {*}\r\n     */\r\n    getModelAsImmutable() {\r\n        return Object.assign(Object.create(Object.getPrototypeOf(this.model)), this.model);\r\n    }\r\n\r\n    subscribe(observer) {\r\n        if (((typeof observer[\"notify\"]) == \"function\")) {\r\n            this.subscribers.add(observer);\r\n        } else {\r\n            throw new Error(`${observer} doesn't implement async notify(model) method`)\r\n        }\r\n    }\r\n\r\n    unsubscribe(observer) {\r\n        this.subscribers.delete(observer);\r\n    }\r\n}\n\n//# sourceURL=webpack:///./models/observable/Observable.js?");

/***/ }),

/***/ "./values/strings.en.json":
/*!********************************!*\
  !*** ./values/strings.en.json ***!
  \********************************/
/*! exports provided: incorrect, default */
/***/ (function(module) {

eval("module.exports = JSON.parse(\"{\\\"incorrect\\\":{\\\"password\\\":\\\"Password (length not less than 8) should contains uppercase, numbers and any of @$!%_*#?&\\\",\\\"repeated_password\\\":\\\"Passwords doesn't match\\\",\\\"email\\\":\\\"Incorrect email address\\\",\\\"phone\\\":\\\"Incorrect phone number. Format: +xxxxxx...\\\",\\\"username\\\":\\\"Username (length not less than 5) should contains only letters, numbers and _ (optional)\\\"}}\");\n\n//# sourceURL=webpack:///./values/strings.en.json?");

/***/ }),

/***/ "./views/ContainerView.js":
/*!********************************!*\
  !*** ./views/ContainerView.js ***!
  \********************************/
/*! exports provided: ContainerView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ContainerView\", function() { return ContainerView; });\n/* harmony import */ var _View__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./View */ \"./views/View.js\");\n/* harmony import */ var _models_observable_Observable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/observable/Observable */ \"./models/observable/Observable.js\");\n\r\n\r\n\r\nclass ContainerView extends _View__WEBPACK_IMPORTED_MODULE_0__[\"View\"] {\r\n\r\n    /**\r\n     * @param {HTMLElement|View} parent - content container\r\n     * @param model {Observable} - observable model with user information\r\n     */\r\n    constructor(parent = null, model) {\r\n        super(parent, model);\r\n        model.subscribe(this);\r\n    }\r\n\r\n    async notify(model) {\r\n        console.log(model); // TODO: update view\r\n    }\r\n\r\n    render() {\r\n        return super._render(`\r\n        <div class=\"header-menu\">\r\n            <div class=\"status\"></div>\r\n            <nav class=\"header-nav\"></nav>\r\n            <div class=\"sign\"></div>\r\n        </div>\r\n        <div id=\"root\">\r\n            <a href=\"/sign\">Sign Page</a>\r\n        </div>\r\n        <footer>\r\n        </footer>`, \"#root\");\r\n    }\r\n}\n\n//# sourceURL=webpack:///./views/ContainerView.js?");

/***/ }),

/***/ "./views/ErrorView.js":
/*!****************************!*\
  !*** ./views/ErrorView.js ***!
  \****************************/
/*! exports provided: ErrorView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ErrorView\", function() { return ErrorView; });\n/* harmony import */ var _View__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./View */ \"./views/View.js\");\n/* harmony import */ var _models_PageError__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/PageError */ \"./models/PageError.js\");\n\r\n\r\n\r\nclass ErrorView extends _View__WEBPACK_IMPORTED_MODULE_0__[\"View\"] {\r\n\r\n    /**\r\n     * @param {HTMLElement|View} parent - content container\r\n     * @param {PageError} model - view model\r\n     */\r\n    constructor(parent = null, model = undefined) {\r\n        super(parent, model);\r\n    }\r\n\r\n    render() {\r\n        return this._render(`<div id=\"notfound\">\r\n                <div class=\"notfound\">\r\n                    <div class=\"notfound-code\">\r\n                        <h1>Oops!</h1>\r\n                    </div>\r\n                    <h2>${this.model.code} - ${this.model.message}</h2>\r\n                    <p>${this.model.describe}</p>\r\n                    <a href=\"/\">Go To Homepage</a>\r\n                </div>\r\n            </div>`)\r\n    }\r\n}\n\n//# sourceURL=webpack:///./views/ErrorView.js?");

/***/ }),

/***/ "./views/SignView.js":
/*!***************************!*\
  !*** ./views/SignView.js ***!
  \***************************/
/*! exports provided: EVENT, SignView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"EVENT\", function() { return EVENT; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"SignView\", function() { return SignView; });\n/* harmony import */ var _View__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./View */ \"./views/View.js\");\n/* harmony import */ var _models_dto_LoginDto__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/dto/LoginDto */ \"./models/dto/LoginDto.js\");\n/* harmony import */ var _models_dto_RegistrationDto__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/dto/RegistrationDto */ \"./models/dto/RegistrationDto.js\");\n/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../app */ \"./app.js\");\n\r\n\r\n\r\n\r\n\r\nclass SignView extends _View__WEBPACK_IMPORTED_MODULE_0__[\"View\"] {\r\n\r\n    /**\r\n     * @param {HTMLElement|View} parent - content container\r\n     * @param {Object=} model - view model\r\n     */\r\n    constructor(parent = null, model = undefined) {\r\n        super(parent, model);\r\n    }\r\n\r\n    render() {\r\n        this._render(`\r\n            <div class=\"login-wrap\">\r\n                <div class=\"login-html\">\r\n                    <input id=\"tab-1\" type=\"radio\" name=\"tab\" class=\"sign-in\" checked><label for=\"tab-1\" class=\"tab\">Sign In</label>\r\n                    <input id=\"tab-2\" type=\"radio\" name=\"tab\" class=\"sign-up\"><label for=\"tab-2\" class=\"tab\">Sign Up</label>\r\n                    <div class=\"login-form\">\r\n                        <div class=\"sign-in-htm\">\r\n                            <div class=\"group\">\r\n                                <label for=\"s_email\" class=\"group-label\">Username</label>\r\n                                <input id=\"s_email\" type=\"text\" class=\"form-input\">\r\n                                <span class=\"error-highlight\"></span>\r\n                            </div>\r\n                            <div class=\"group\">\r\n                                <label for=\"s_pass\" class=\"group-label\">Password</label>\r\n                                <input id=\"s_pass\" type=\"password\" class=\"form-input\" data-type=\"password\">\r\n                                <span class=\"error-highlight\"></span>\r\n                            </div>\r\n                            <div class=\"group\">\r\n                                <input id=\"s_check\" type=\"checkbox\" class=\"check\" checked>\r\n                                <label for=\"s_check\"><span class=\"icon\"></span> Keep me Signed in</label>\r\n                            </div>\r\n                            <div class=\"group\">\r\n                                <input type=\"submit\" class=\"accept-form-button\" value=\"Sign In\">\r\n                            </div>\r\n                            <div class=\"hr\"></div>\r\n                            <div class=\"foot-lnk\">\r\n                                <a href=\"#\">Forgot Password?</a>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"sign-up-htm\">\r\n                            <div class=\"group\">\r\n                                <label for=\"username\" class=\"group-label\">Username</label>\r\n                                <input id=\"username\" type=\"text\" class=\"form-input\">\r\n                                <span class=\"error-highlight\"></span>\r\n                            </div>\r\n                            <div class=\"group\">\r\n                                <label for=\"email\" class=\"group-label\">Email Address</label>\r\n                                <input id=\"email\" type=\"text\" class=\"form-input\">\r\n                                <span class=\"error-highlight\"></span>\r\n                            </div>\r\n                            <div class=\"group\">\r\n                                <label for=\"phone\" class=\"group-label\">Full phone number</label>\r\n                                <input id=\"phone\" type=\"text\" class=\"form-input\">\r\n                                <span class=\"error-highlight\"></span>\r\n                            </div>\r\n                            <div class=\"group\">\r\n                                <label for=\"pass\" class=\"group-label\">Password</label>\r\n                                <input id=\"pass\" type=\"password\" class=\"form-input\" data-type=\"password\">\r\n                                <span class=\"error-highlight\"></span>\r\n                            </div>\r\n                            <div class=\"group\">\r\n                                <label for=\"repeat\" class=\"group-label\">Repeat Password</label>\r\n                                <input id=\"repeat\" type=\"password\" class=\"form-input\" data-type=\"password\">\r\n                                <span class=\"error-highlight\"></span>\r\n                            </div>\r\n                            <div class=\"group\">\r\n                                <input type=\"submit\" class=\"accept-form-button\" value=\"Sign Up\">\r\n                            </div>\r\n                            <div class=\"hr\"></div>\r\n                            <div class=\"foot-lnk\">\r\n                                <a href=\"#\">Already Member?</a>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>`);\r\n        this.setEvents();\r\n        return this.container;\r\n    }\r\n\r\n    /**\r\n     * @return {HTMLElement}\r\n     */\r\n    setEvents() {\r\n        this.registrationPasswordLiveValidator();\r\n        this.usernameLiveValidator(this.getHtmlElement(\"#username\"));\r\n        this.emailLiveValidator(this.getHtmlElement(\"#email\"));\r\n        this.phoneLiveValidator(this.getHtmlElement(\"#phone\"));\r\n        this.passwordLiveValidator(this.getHtmlElement(\"#s_pass\"));\r\n        this.emailLiveValidator(this.getHtmlElement(\"#s_email\"));\r\n\r\n        let signs = document.getElementsByClassName(\"accept-form-button\");\r\n        signs[0].addEventListener(\"click\", e => {\r\n            this.callHandler(EVENT.SIGN_IN, this.signInData(), signs[0], e);\r\n        });\r\n        signs[1].addEventListener(\"click\", e => {\r\n            this.callHandler(EVENT.SIGN_UP, this.signUpData(), signs[1], e);\r\n        });\r\n        return this.container;\r\n    }\r\n\r\n    callHandler(type, data, button, e) {\r\n        if (data) {\r\n            this.handler.handle(type, {\r\n                model: data,\r\n                event: e\r\n            }).catch(e => alert(e.message)); // TODO: show error\r\n        } else {\r\n            let color = button.style.backgroundColor;\r\n            button.disabled = true;\r\n            button.style.backgroundColor = \"red\";\r\n            setTimeout(() =>  {\r\n                button.style.backgroundColor = color;\r\n                button.disabled = false;\r\n            }, 2000);\r\n        }\r\n    }\r\n\r\n    signInData() {\r\n        try {\r\n            let dto = new _models_dto_LoginDto__WEBPACK_IMPORTED_MODULE_1__[\"LoginDto\"]();\r\n            dto.password = this.getHtmlElement(\"#s_pass\").value;\r\n            dto.email = this.getHtmlElement(\"#s_email\").value;\r\n            dto.remember = this.getHtmlElement(\"#s_check\").checked;\r\n            return dto.isValid() ? dto : null;\r\n        } catch (e) {\r\n            console.error(e);\r\n        }\r\n    }\r\n\r\n    signUpData() {\r\n        try {\r\n            let dto = new _models_dto_RegistrationDto__WEBPACK_IMPORTED_MODULE_2__[\"RegistrationDto\"]();\r\n            dto.password = this.getHtmlElement(\"#pass\").value;\r\n            dto.repeatedPassword = this.getHtmlElement(\"#repeat\").value;\r\n            dto.username = this.getHtmlElement(\"#username\").value;\r\n            dto.email = this.getHtmlElement(\"#email\").value;\r\n            dto.phone = this.getHtmlElement(\"#phone\").value;\r\n            return dto.isValid() ? dto : null;\r\n        } catch (e) {\r\n            console.error(e);\r\n        }\r\n    }\r\n\r\n    /**\r\n     * Synchronized inputs for password and for its repeated input\r\n     */\r\n    registrationPasswordLiveValidator() {\r\n        let passInput = this.getHtmlElement(\"#pass\");\r\n        passInput.addEventListener(\"input\", validator);\r\n        let repeatPassInput = this.getHtmlElement(\"#repeat\");\r\n        repeatPassInput.addEventListener(\"input\", validator);\r\n        function validator() {\r\n            if (!_app__WEBPACK_IMPORTED_MODULE_3__[\"app\"].validator.isValidPassword(passInput.value)) {\r\n                passInput.nextElementSibling.innerText = _app__WEBPACK_IMPORTED_MODULE_3__[\"app\"].values.incorrect.password;\r\n            } else {\r\n                passInput.nextElementSibling.innerText = \"\";\r\n            }\r\n            if (passInput.value !== repeatPassInput.value) {\r\n                repeatPassInput.nextElementSibling.innerText = _app__WEBPACK_IMPORTED_MODULE_3__[\"app\"].values.incorrect.repeated_password;\r\n            } else {\r\n                repeatPassInput.nextElementSibling.innerText = \"\";\r\n            }\r\n        }\r\n    }\r\n\r\n    /**\r\n     * @param input - html element <input />\r\n     * @return input\r\n     */\r\n    usernameLiveValidator(input) {\r\n        this.setupLiveValidator(input, _app__WEBPACK_IMPORTED_MODULE_3__[\"app\"].values.incorrect.username,\r\n                str => _app__WEBPACK_IMPORTED_MODULE_3__[\"app\"].validator.isValidUsername(str))\r\n    }\r\n\r\n    /**\r\n     * @param input - html element <input />\r\n     * @return input\r\n     */\r\n    passwordLiveValidator(input) {\r\n        this.setupLiveValidator(input, _app__WEBPACK_IMPORTED_MODULE_3__[\"app\"].values.incorrect.password,\r\n                str => _app__WEBPACK_IMPORTED_MODULE_3__[\"app\"].validator.isValidPassword(str))\r\n    }\r\n\r\n    /**\r\n     * @param input - html element <input />\r\n     * @return input\r\n     */\r\n    emailLiveValidator(input) {\r\n        this.setupLiveValidator(input, _app__WEBPACK_IMPORTED_MODULE_3__[\"app\"].values.incorrect.email,\r\n                str => _app__WEBPACK_IMPORTED_MODULE_3__[\"app\"].validator.isValidEmail(str))\r\n    }\r\n\r\n    /**\r\n     * @param input - html element <input />\r\n     * @return input\r\n     */\r\n    phoneLiveValidator(input) {\r\n        this.setupLiveValidator(input, _app__WEBPACK_IMPORTED_MODULE_3__[\"app\"].values.incorrect.phone,\r\n                str => _app__WEBPACK_IMPORTED_MODULE_3__[\"app\"].validator.isValidPhoneNumber(str))\r\n    }\r\n\r\n    /**\r\n     * Predicate function with one parameter\r\n     * @param item {*}\r\n     * @return {boolean}\r\n     * @callback predicateFunc\r\n     */\r\n\r\n    /**\r\n     * Setup listener for input\r\n     * @param input - html element <input />\r\n     * @param errorMessage {String} - error message, tip for user\r\n     * @param predicate {predicateFunc}\r\n     * @return input\r\n     */\r\n    setupLiveValidator(input, errorMessage, predicate) {\r\n        input.addEventListener(\"input\", _ => {\r\n            if (!predicate(input.value)) {\r\n                input.nextElementSibling.innerText = errorMessage;\r\n            } else {\r\n                input.nextElementSibling.innerText = \"\";\r\n            }\r\n        });\r\n        return input;\r\n    }\r\n}\r\n\r\nconst EVENT = {\r\n    SIGN_UP: \"up\",\r\n    SIGN_IN: \"in\"\r\n};\r\n\r\n\n\n//# sourceURL=webpack:///./views/SignView.js?");

/***/ }),

/***/ "./views/View.js":
/*!***********************!*\
  !*** ./views/View.js ***!
  \***********************/
/*! exports provided: View */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"View\", function() { return View; });\n/* harmony import */ var _controllers_ViewEvent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../controllers/ViewEvent */ \"./controllers/ViewEvent.js\");\n/**\r\n * All view must be override all methods\r\n */\r\n\r\n\r\nclass View {\r\n\r\n    /**\r\n     * @param {HTMLElement|View} parent - content container\r\n     * @param model - view model\r\n     */\r\n    constructor(parent= null, model = null) {\r\n        this.container = null;\r\n        this.parent = parent;\r\n        this.model = model;\r\n        /**\r\n         * @type {ViewEvent}\r\n         */\r\n        this.handler = null;\r\n        /**\r\n         * @type {Map<String, HTMLElement>}\r\n         * @private\r\n         */\r\n        this._htmlCache = new Map();\r\n    }\r\n\r\n    /**\r\n     * Method to override\r\n     * @return {HTMLElement} - content container\r\n     */\r\n    render() {\r\n        throw new Error(\"Render wasn't override\");\r\n    }\r\n\r\n    /**\r\n     * Method to override, set event handler on view\r\n     * @param handler {ViewEvent}\r\n     */\r\n    setHandler(handler) {\r\n        this.handler = handler;\r\n    }\r\n\r\n    /**\r\n     * Find and cache html element inside current container (if it's class return first in DOM)\r\n     * @param selector {String} - id or class selector for child container\r\n     * @return HTMLElement\r\n     */\r\n    getHtmlElement(selector) {\r\n        if (this.container) {\r\n            let element = this._htmlCache.get(selector);\r\n            if (!element) {\r\n                element = this._getElementBySelector(this.container, selector);\r\n                this._htmlCache.set(selector, element);\r\n            }\r\n            return element;\r\n        }\r\n    }\r\n\r\n    /**\r\n     * Insert {html} code into parent block\r\n     * @param html {String} - html code\r\n     * @param root {String=} - id or class selector for child container\r\n     * @return {HTMLElement} - container if view rendered itself, otherwise view's html string\r\n     * @protected\r\n     */\r\n    _render(html, root = undefined) {\r\n        let container = this.parent instanceof View ? this.parent.render() : this.parent;\r\n        container.innerHTML = html;\r\n        if (root) {\r\n            container = this._getElementBySelector(container, root);\r\n            if (!container) {\r\n                throw new Error(`Selector ${root} not found (it's should be id or class)`);\r\n            }\r\n        }\r\n        return (this.container = container);\r\n    }\r\n\r\n    /**\r\n     * Find html element inside container (if it's class return first in DOM)\r\n     * @param container - container for search\r\n     * @param selector - selector class or id\r\n     * @return {HTMLElement}\r\n     * @private\r\n     */\r\n    _getElementBySelector(container, selector) {\r\n        return selector.startsWith(\"#\") ? document.getElementById(selector.substring(1)) :\r\n            (selector.startsWith(\".\") ? container.getElementsByClassName(selector.substring(1))[0] : undefined);\r\n    }\r\n}\n\n//# sourceURL=webpack:///./views/View.js?");

/***/ })

/******/ });