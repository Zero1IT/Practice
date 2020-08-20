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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Fetcher\", function() { return Fetcher; });\n/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app */ \"./app.js\");\n/* harmony import */ var _httpStatus__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./httpStatus */ \"./httpStatus.js\");\n\r\n\r\n\r\nclass Fetcher {\r\n    /**\r\n     * @return Promise<Response> - fetch() promise\r\n     */\r\n    async jsonRequest(url, method = \"GET\", jsonData = undefined) {\r\n        let auth = await this.updateJwtTokenHeader();\r\n        return fetch(url, {\r\n            method: method,\r\n            headers: {\r\n                \"Content-Type\": \"application/json;charset=utf-8\",\r\n                \"Authorization\": auth\r\n            },\r\n            body: jsonData\r\n        });\r\n    }\r\n\r\n    async updateJwtTokenHeader() {\r\n        if (_app__WEBPACK_IMPORTED_MODULE_0__[\"app\"].token) {\r\n            let isEnd = new Date().getTime() > _app__WEBPACK_IMPORTED_MODULE_0__[\"app\"].tokenPayload.exp * 1000;\r\n            if (isEnd) {\r\n                await this.refreshTokenRequest();\r\n            }\r\n        } else if (_app__WEBPACK_IMPORTED_MODULE_0__[\"app\"].refreshToken) {\r\n            await this.refreshTokenRequest();\r\n        }\r\n        return `Bearer ${_app__WEBPACK_IMPORTED_MODULE_0__[\"app\"].token}`;\r\n    }\r\n\r\n    async refreshTokenRequest() {\r\n        let response = await fetch(_app__WEBPACK_IMPORTED_MODULE_0__[\"URLS\"].refreshToken, {\r\n            method: \"POST\",\r\n            headers: {\r\n                \"Content-Type\": \"application/json;charset=utf-8\"\r\n            },\r\n            body: JSON.stringify({token: _app__WEBPACK_IMPORTED_MODULE_0__[\"app\"].refreshToken})\r\n        });\r\n        if (response.ok) {\r\n            await _app__WEBPACK_IMPORTED_MODULE_0__[\"app\"].acceptJwtToken(await response.json());\r\n        } else if (response.status === _httpStatus__WEBPACK_IMPORTED_MODULE_1__[\"statusCodes\"].UNAUTHORIZED) {\r\n            // TODO: then or always redirect\r\n        }\r\n    }\r\n\r\n    /**\r\n     * Returns response if status 200 (OK), or handles another status\r\n     * @param response {Response}\r\n     * @param excludedCodes {Array<Number>} - codes that will not be handled\r\n     * @return {Response} - given response, or undefined if status isn't 200\r\n     */\r\n    clearResponse(response, excludedCodes) {\r\n        if (response.ok || excludedCodes.includes(response.status)) {\r\n            return response;\r\n        }\r\n\r\n        switch (response.status) {\r\n            case _httpStatus__WEBPACK_IMPORTED_MODULE_1__[\"statusCodes\"].UNAUTHORIZED:\r\n                // TODO: wasn't authorize\r\n                break;\r\n            case _httpStatus__WEBPACK_IMPORTED_MODULE_1__[\"statusCodes\"].FORBIDDEN:\r\n                // TODO: invalid credentials\r\n                break;\r\n            case _httpStatus__WEBPACK_IMPORTED_MODULE_1__[\"statusCodes\"].BAD_REQUEST:\r\n                // TODO: incorrect request\r\n                break;\r\n        }\r\n\r\n        return undefined;\r\n    }\r\n}\n\n//# sourceURL=webpack:///./Fetcher.js?");

/***/ }),

/***/ "./ProgressLoader.js":
/*!***************************!*\
  !*** ./ProgressLoader.js ***!
  \***************************/
/*! exports provided: progress */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"progress\", function() { return progress; });\nclass ProgressLoader {\r\n    constructor() {\r\n        this.init();\r\n    }\r\n\r\n    init() {\r\n        this.preloader = document.getElementById(\"preloader\");\r\n        this.preloader.style.display = \"none\";\r\n        this.waitersCount = 0;\r\n        this.hidden = true;\r\n    }\r\n\r\n    show() {\r\n        ++this.waitersCount;\r\n        if (this.hidden) {\r\n            this.preloader.style.display = \"flex\";\r\n            this.hidden = false;\r\n        }\r\n    }\r\n\r\n    hide() {\r\n        --this.waitersCount;\r\n        if (!this.hidden && this.waitersCount === 0) {\r\n            this.preloader.style.display = \"none\";\r\n            this.hidden = true;\r\n        }\r\n    }\r\n}\r\n\r\nconst progress = new ProgressLoader();\r\n\r\n\n\n//# sourceURL=webpack:///./ProgressLoader.js?");

/***/ }),

/***/ "./Router.js":
/*!*******************!*\
  !*** ./Router.js ***!
  \*******************/
/*! exports provided: Router */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Router\", function() { return Router; });\n/* harmony import */ var _ProgressLoader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ProgressLoader */ \"./ProgressLoader.js\");\n\r\n\r\nclass Router {\r\n    /**\r\n     * Callback for handle url\r\n     * @callback notFoundCallback\r\n     * @param {String} path - not founded path\r\n     * @return {Promise<*>}\r\n     */\r\n\r\n    /**\r\n     * @param {{page404: notFoundCallback}=} options\r\n     */\r\n    constructor(options) {\r\n        /**\r\n         * @type {Map<String, urlHandler>}\r\n         */\r\n        this.urlMap = new Map();\r\n        this.options = options;\r\n    }\r\n\r\n    /**\r\n     * Callback for handle url\r\n     * @callback urlHandler - async function\r\n     * @param url {String=}\r\n     * @param index {Number=} - index of symbol '?' for eject params\r\n     * @return {Promise<*>}\r\n     */\r\n\r\n    /**\r\n     * Add url handler to router\r\n     * @param {String} url - handled url\r\n     * @param {urlHandler} handler - callback function\r\n     */\r\n    add(url, handler) {\r\n        this.urlMap.set(url, handler);\r\n    }\r\n\r\n    /**\r\n     * Navigate to given url\r\n     * @param {String} url\r\n     * @param {Boolean=} silent - false for add to history otherwise true\r\n     * @param replace {Boolean=} - use replaceState\r\n     */\r\n    navigateTo(url, silent= false, replace = false) {\r\n        let paramIndex = url.indexOf(\"?\");\r\n        let handler = this.urlMap.get(paramIndex < 0 ? url : url.substring(0, paramIndex));\r\n        if (handler) {\r\n            _ProgressLoader__WEBPACK_IMPORTED_MODULE_0__[\"progress\"].show();\r\n            if (!silent) {\r\n                if (replace) {\r\n                    history.replaceState(null, null, url);\r\n                } else {\r\n                    history.pushState(null, null, url);\r\n                }\r\n            }\r\n            handler(url, paramIndex)\r\n                .then(() => _ProgressLoader__WEBPACK_IMPORTED_MODULE_0__[\"progress\"].hide())\r\n                .catch(e => console.error(`Unhandled error (navigateTo) - ${e}`));\r\n        } else if (this.options && this.options.page404) {\r\n            this.options.page404(url)\r\n                .catch(e => console.error(`Unhandled error ${e}`));\r\n        } else {\r\n            alert(`Cannot handle navigate to ${url}`)\r\n        }\r\n    }\r\n\r\n    startListener() {\r\n        window.onpopstate = () => this.popstateBinder();\r\n    }\r\n\r\n    popstateBinder() {\r\n        this.navigateTo(window.location.pathname, true);\r\n    }\r\n}\n\n//# sourceURL=webpack:///./Router.js?");

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
/*! exports provided: App, app, URLS, resources */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"App\", function() { return App; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"app\", function() { return app; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"URLS\", function() { return URLS; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"resources\", function() { return resources; });\n/* harmony import */ var _Validator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Validator */ \"./Validator.js\");\n/* harmony import */ var _Fetcher__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Fetcher */ \"./Fetcher.js\");\n/* harmony import */ var _values_strings_en__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./values/strings.en */ \"./values/strings.en.json\");\nvar _values_strings_en__WEBPACK_IMPORTED_MODULE_2___namespace = /*#__PURE__*/__webpack_require__.t(/*! ./values/strings.en */ \"./values/strings.en.json\", 1);\n/* harmony import */ var _models_dto_UserDto__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./models/dto/UserDto */ \"./models/dto/UserDto.js\");\n/* harmony import */ var _navigator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./navigator */ \"./navigator.js\");\n/* harmony import */ var _ProgressLoader__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ProgressLoader */ \"./ProgressLoader.js\");\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nconst REFRESH_TOKEN_KEY = \"jwt_refresh_token\";\r\n\r\n/**\r\n * @typedef {{\r\n *     strings: {rootPage: *, playPage: *, preloader: *}\r\n * }} LangRes\r\n *\r\n * @type {LangRes}\r\n */\r\nconst resources = {\r\n    strings: {}\r\n};\r\n\r\nconst URLS = {\r\n    login: \"/api/sign/login\",\r\n    registration: \"/api/sign/registration\",\r\n    getNewPlays: \"/api/plays/future\",\r\n    userInfo: \"/api/users/info\",\r\n    refreshToken: \"/api/sign/refresh-token\",\r\n    loadLanguage: \"/api/sign/lang\",\r\n    signOut: \"/api/sign/sign-out\",\r\n};\r\n\r\nconst LOCALE = {\r\n    RU: \"ru\",\r\n    EN: \"en-US\"\r\n};\r\n\r\nclass App {\r\n\r\n    constructor() {\r\n        this.validator          = new _Validator__WEBPACK_IMPORTED_MODULE_0__[\"Validator\"]();\r\n        this.fetcher            = new _Fetcher__WEBPACK_IMPORTED_MODULE_1__[\"Fetcher\"]();\r\n        this.locale             = this.defaultLocale();\r\n        this.values             = _values_strings_en__WEBPACK_IMPORTED_MODULE_2__;\r\n        this.router             = null;\r\n        this.dataDefaultInit();\r\n    }\r\n\r\n    dataDefaultInit() {\r\n        this.isInitialized      = false;\r\n        this.refreshToken       = localStorage.getItem(REFRESH_TOKEN_KEY);\r\n        this.tokenPayload       = null;\r\n        this.token              = null;\r\n        /** @type {UserDto} */\r\n        this.user               = null;\r\n    }\r\n\r\n    /**\r\n     * Save jwt token\r\n     * @param token - valid jwt token\r\n     */\r\n    async acceptJwtToken(token) {\r\n        try {\r\n            this.refreshToken = token.refresh;\r\n            this.token = token.access;\r\n            let payload = this.token.split(\".\")[1];\r\n            this.tokenPayload = JSON.parse(atob(payload));\r\n            localStorage.setItem(REFRESH_TOKEN_KEY, this.refreshToken);\r\n            await this.loadUserInfo();\r\n        } catch (e) {\r\n            console.error(e);\r\n        }\r\n    }\r\n\r\n    async loadUserInfo() {\r\n        let response = await this.fetcher.jsonRequest(URLS.userInfo);\r\n        if (response.ok) {\r\n            this.user = await response.json();\r\n        } else {\r\n            console.log(response);\r\n            // TODO:\r\n        }\r\n    }\r\n\r\n    async initializeApp(primary = true) {\r\n        _ProgressLoader__WEBPACK_IMPORTED_MODULE_5__[\"progress\"].show();\r\n        if (this.isInitialized) {\r\n            throw new Error(\"App has already initialized\");\r\n        }\r\n        await loadResources();\r\n        if (this.refreshToken) {\r\n            await app.fetcher.refreshTokenRequest();\r\n        }\r\n        this.router = Object(_navigator__WEBPACK_IMPORTED_MODULE_4__[\"createRouter\"])(this);\r\n        if (primary) {\r\n            this.router.navigateTo(window.location.pathname, true);\r\n        }\r\n        this.isInitialized = true;\r\n        _ProgressLoader__WEBPACK_IMPORTED_MODULE_5__[\"progress\"].hide();\r\n    }\r\n\r\n    /**\r\n     * @param newLocale {String} - locale name\r\n     */\r\n    async changeLocale(newLocale) {\r\n        let lc = newLocale.toUpperCase();\r\n        for (let key in LOCALE) {\r\n            if (key === lc) {\r\n                this.locale = LOCALE[key];\r\n                await loadResources(key);\r\n                this.router.navigateTo(window.location.pathname, false, true);\r\n                return;\r\n            }\r\n        }\r\n        throw new Error(`Invalid locale ${newLocale}`);\r\n    }\r\n\r\n    async signOut() {\r\n        await this.fetcher.jsonRequest(URLS.signOut, \"POST\"); // first remove token from server\r\n        localStorage.removeItem(REFRESH_TOKEN_KEY);\r\n        this.dataDefaultInit();\r\n        await this.initializeApp(false);\r\n    }\r\n\r\n    defaultLocale() {\r\n        let lc = navigator.language;\r\n        for (let key in LOCALE) {\r\n            if (LOCALE[key] === lc) {\r\n                return LOCALE[key];\r\n            }\r\n        }\r\n        return LOCALE.EN;\r\n    }\r\n}\r\n\r\nasync function loadResources(name = null) {\r\n    let param = name ? `?locale=${name}` : \"\";\r\n    let response = await app.fetcher.jsonRequest(`${URLS.loadLanguage}${param}`);\r\n    if (response.ok) {\r\n        resources.strings = await response.json();\r\n    } else {\r\n        console.error(response); // TODO; stop app\r\n    }\r\n}\r\n\r\nconst app = new App();\r\napp.initializeApp()\r\n    .catch(console.error);\r\n\r\n\r\n\n\n//# sourceURL=webpack:///./app.js?");

/***/ }),

/***/ "./controllers/ContainerController.js":
/*!********************************************!*\
  !*** ./controllers/ContainerController.js ***!
  \********************************************/
/*! exports provided: ContainerController */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ContainerController\", function() { return ContainerController; });\n/* harmony import */ var _Controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Controller */ \"./controllers/Controller.js\");\n/* harmony import */ var _views_ContainerView__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../views/ContainerView */ \"./views/ContainerView.js\");\n/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../app */ \"./app.js\");\n/* harmony import */ var _navigator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../navigator */ \"./navigator.js\");\n\r\n\r\n\r\n\r\n\r\nclass ContainerController extends _Controller__WEBPACK_IMPORTED_MODULE_0__[\"Controller\"] {\r\n\r\n    async handle(eventType, data = null) {\r\n        switch(eventType) {\r\n            case _views_ContainerView__WEBPACK_IMPORTED_MODULE_1__[\"EVENT\"].loadResource:\r\n                await _app__WEBPACK_IMPORTED_MODULE_2__[\"app\"].changeLocale(data);\r\n                break;\r\n            case _views_ContainerView__WEBPACK_IMPORTED_MODULE_1__[\"EVENT\"].signOut:\r\n                await _app__WEBPACK_IMPORTED_MODULE_2__[\"app\"].signOut();\r\n                _app__WEBPACK_IMPORTED_MODULE_2__[\"app\"].router.navigateTo(_navigator__WEBPACK_IMPORTED_MODULE_3__[\"NAVIGATOR\"].HOME);\r\n                break;\r\n        }\r\n    }\r\n}\n\n//# sourceURL=webpack:///./controllers/ContainerController.js?");

/***/ }),

/***/ "./controllers/Controller.js":
/*!***********************************!*\
  !*** ./controllers/Controller.js ***!
  \***********************************/
/*! exports provided: Controller */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Controller\", function() { return Controller; });\nclass Controller {\r\n\r\n    /**\r\n     * Handle view event\r\n     * @param eventType - type of event (some constant understandable for Controller)\r\n     * @param data - some model understandable for Controller\r\n     * @return {Promise<void>} - promise is handling inside view\r\n     */\r\n    async handle(eventType, data = null) {\r\n        throw new Error(\"Handler isn't support\");\r\n    }\r\n\r\n    /**\r\n     * Loads data for view, and return it\r\n     * @return {Promise<*>} - promise is wrapping some model\r\n     */\r\n    async init() {\r\n        throw new Error(\"Controller doesn't support init()\")\r\n    }\r\n}\n\n//# sourceURL=webpack:///./controllers/Controller.js?");

/***/ }),

/***/ "./controllers/PlayController.js":
/*!***************************************!*\
  !*** ./controllers/PlayController.js ***!
  \***************************************/
/*! exports provided: PlayController */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"PlayController\", function() { return PlayController; });\n/* harmony import */ var _Controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Controller */ \"./controllers/Controller.js\");\n/* harmony import */ var _views_parts_PlayItemViewPart__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../views/parts/PlayItemViewPart */ \"./views/parts/PlayItemViewPart.js\");\n/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../app */ \"./app.js\");\n\r\n\r\n\r\n\r\nclass PlayController extends _Controller__WEBPACK_IMPORTED_MODULE_0__[\"Controller\"] {\r\n\r\n    /**\r\n     * @return {Promise<Array<PlayItemViewPart>>}\r\n     */\r\n    async init() {\r\n        let response = await _app__WEBPACK_IMPORTED_MODULE_2__[\"app\"].fetcher.jsonRequest(_app__WEBPACK_IMPORTED_MODULE_2__[\"URLS\"].getNewPlays, \"GET\");\r\n        if (response.ok) {\r\n            return response.json();\r\n        } else {\r\n            throw new Error(`${response.status}`);\r\n        }\r\n    }\r\n}\n\n//# sourceURL=webpack:///./controllers/PlayController.js?");

/***/ }),

/***/ "./controllers/SignController.js":
/*!***************************************!*\
  !*** ./controllers/SignController.js ***!
  \***************************************/
/*! exports provided: SignController */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"SignController\", function() { return SignController; });\n/* harmony import */ var _Controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Controller */ \"./controllers/Controller.js\");\n/* harmony import */ var _views_SignView__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../views/SignView */ \"./views/SignView.js\");\n/* harmony import */ var _models_dto_LoginDto__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/dto/LoginDto */ \"./models/dto/LoginDto.js\");\n/* harmony import */ var _models_dto_RegistrationDto__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../models/dto/RegistrationDto */ \"./models/dto/RegistrationDto.js\");\n/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../app */ \"./app.js\");\n/* harmony import */ var _navigator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../navigator */ \"./navigator.js\");\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nclass SignController extends _Controller__WEBPACK_IMPORTED_MODULE_0__[\"Controller\"] {\r\n\r\n    async handle(eventType, data) {\r\n        switch (eventType) {\r\n            case _views_SignView__WEBPACK_IMPORTED_MODULE_1__[\"EVENT\"].SIGN_IN:\r\n                await this.signIn(data);\r\n                break;\r\n            case _views_SignView__WEBPACK_IMPORTED_MODULE_1__[\"EVENT\"].SIGN_UP:\r\n                await this.signUp(data);\r\n                break;\r\n        }\r\n    }\r\n\r\n    /**\r\n     * @param data {{event: EventListener, model: LoginDto}}\r\n     * @return {Promise<void>}\r\n     */\r\n    async signIn(data) {\r\n        this.doSign(data, _app__WEBPACK_IMPORTED_MODULE_4__[\"URLS\"].login);\r\n    }\r\n\r\n    /**\r\n     * @param data {{event: EventListener, model: RegistrationDto}}\r\n     * @return {Promise<void>}\r\n     */\r\n    async signUp(data) {\r\n        await this.doSign(data, _app__WEBPACK_IMPORTED_MODULE_4__[\"URLS\"].registration);\r\n    }\r\n\r\n    async doSign(data, url) {\r\n        let response = await _app__WEBPACK_IMPORTED_MODULE_4__[\"app\"].fetcher.jsonRequest(url, \"POST\", data.model.toJson());\r\n        if (response.ok) {\r\n            let json = await response.json();\r\n            await _app__WEBPACK_IMPORTED_MODULE_4__[\"app\"].acceptJwtToken(json);\r\n            _app__WEBPACK_IMPORTED_MODULE_4__[\"app\"].router.navigateTo(_navigator__WEBPACK_IMPORTED_MODULE_5__[\"NAVIGATOR\"].HOME, false, true);\r\n        } else {\r\n            throw new Error(`${response.status}`);\r\n        }\r\n    }\r\n}\n\n//# sourceURL=webpack:///./controllers/SignController.js?");

/***/ }),

/***/ "./httpStatus.js":
/*!***********************!*\
  !*** ./httpStatus.js ***!
  \***********************/
/*! exports provided: getStatusCode, getStatusText, statusTexts, statusCodes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getStatusCode\", function() { return getStatusCode; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getStatusText\", function() { return getStatusText; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"statusTexts\", function() { return statusTexts; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"statusCodes\", function() { return statusCodes; });\n/**\r\n * Author: https://github.com/prettymuchbryce/http-status-codes\r\n */\r\n\r\nconst statusCodes = {};\r\nconst statusTexts = {};\r\n\r\nstatusTexts[statusCodes.ACCEPTED = 202] = \"Accepted\";\r\nstatusTexts[statusCodes.BAD_GATEWAY = 502] = \"Bad Gateway\";\r\nstatusTexts[statusCodes.BAD_REQUEST = 400] = \"Bad Request\";\r\nstatusTexts[statusCodes.CONFLICT = 409] = \"Conflict\";\r\nstatusTexts[statusCodes.CONTINUE = 100] = \"Continue\";\r\nstatusTexts[statusCodes.CREATED = 201] = \"Created\";\r\nstatusTexts[statusCodes.EXPECTATION_FAILED = 417] = \"Expectation Failed\";\r\nstatusTexts[statusCodes.FAILED_DEPENDENCY  = 424] = \"Failed Dependency\";\r\nstatusTexts[statusCodes.FORBIDDEN = 403] = \"Forbidden\";\r\nstatusTexts[statusCodes.GATEWAY_TIMEOUT = 504] = \"Gateway Timeout\";\r\nstatusTexts[statusCodes.GONE = 410] = \"Gone\";\r\nstatusTexts[statusCodes.HTTP_VERSION_NOT_SUPPORTED = 505] = \"HTTP Version Not Supported\";\r\nstatusTexts[statusCodes.IM_A_TEAPOT = 418] = \"I'm a teapot\";\r\nstatusTexts[statusCodes.INSUFFICIENT_SPACE_ON_RESOURCE = 419] = \"Insufficient Space on Resource\";\r\nstatusTexts[statusCodes.INSUFFICIENT_STORAGE = 507] = \"Insufficient Storage\";\r\nstatusTexts[statusCodes.INTERNAL_SERVER_ERROR = 500] = \"Server Error\";\r\nstatusTexts[statusCodes.LENGTH_REQUIRED = 411] = \"Length Required\";\r\nstatusTexts[statusCodes.LOCKED = 423] = \"Locked\";\r\nstatusTexts[statusCodes.METHOD_FAILURE = 420] = \"Method Failure\";\r\nstatusTexts[statusCodes.METHOD_NOT_ALLOWED = 405] = \"Method Not Allowed\";\r\nstatusTexts[statusCodes.MOVED_PERMANENTLY = 301] = \"Moved Permanently\";\r\nstatusTexts[statusCodes.MOVED_TEMPORARILY = 302] = \"Moved Temporarily\";\r\nstatusTexts[statusCodes.MULTI_STATUS = 207] = \"Multi-Status\";\r\nstatusTexts[statusCodes.MULTIPLE_CHOICES = 300] = \"Multiple Choices\";\r\nstatusTexts[statusCodes.NETWORK_AUTHENTICATION_REQUIRED = 511] = \"Network Authentication Required\";\r\nstatusTexts[statusCodes.NO_CONTENT = 204] = \"No Content\";\r\nstatusTexts[statusCodes.NON_AUTHORITATIVE_INFORMATION = 203] = \"Non Authoritative Information\";\r\nstatusTexts[statusCodes.NOT_ACCEPTABLE = 406] = \"Not Acceptable\";\r\nstatusTexts[statusCodes.NOT_FOUND = 404] = \"Not Found\";\r\nstatusTexts[statusCodes.NOT_IMPLEMENTED = 501] = \"Not Implemented\";\r\nstatusTexts[statusCodes.NOT_MODIFIED = 304] = \"Not Modified\";\r\nstatusTexts[statusCodes.OK = 200] = \"OK\";\r\nstatusTexts[statusCodes.PARTIAL_CONTENT = 206] = \"Partial Content\";\r\nstatusTexts[statusCodes.PAYMENT_REQUIRED = 402] = \"Payment Required\";\r\nstatusTexts[statusCodes.PERMANENT_REDIRECT = 308] = \"Permanent Redirect\";\r\nstatusTexts[statusCodes.PRECONDITION_FAILED = 412] = \"Precondition Failed\";\r\nstatusTexts[statusCodes.PRECONDITION_REQUIRED = 428] = \"Precondition Required\";\r\nstatusTexts[statusCodes.PROCESSING = 102] = \"Processing\";\r\nstatusTexts[statusCodes.PROXY_AUTHENTICATION_REQUIRED = 407] = \"Proxy Authentication Required\";\r\nstatusTexts[statusCodes.REQUEST_HEADER_FIELDS_TOO_LARGE = 431] = \"Request Header Fields Too Large\";\r\nstatusTexts[statusCodes.REQUEST_TIMEOUT = 408] = \"Request Timeout\";\r\nstatusTexts[statusCodes.REQUEST_TOO_LONG = 413] = \"Request Entity Too Large\";\r\nstatusTexts[statusCodes.REQUEST_URI_TOO_LONG = 414] = \"Request-URI Too Long\";\r\nstatusTexts[statusCodes.REQUESTED_RANGE_NOT_SATISFIABLE = 416] = \"Requested Range Not Satisfiable\";\r\nstatusTexts[statusCodes.RESET_CONTENT = 205] = \"Reset Content\";\r\nstatusTexts[statusCodes.SEE_OTHER = 303] = \"See Other\";\r\nstatusTexts[statusCodes.SERVICE_UNAVAILABLE = 503] = \"Service Unavailable\";\r\nstatusTexts[statusCodes.SWITCHING_PROTOCOLS = 101] = \"Switching Protocols\";\r\nstatusTexts[statusCodes.TEMPORARY_REDIRECT = 307] = \"Temporary Redirect\";\r\nstatusTexts[statusCodes.TOO_MANY_REQUESTS = 429] = \"Too Many Requests\";\r\nstatusTexts[statusCodes.UNAUTHORIZED = 401] = \"Unauthorized\";\r\nstatusTexts[statusCodes.UNPROCESSABLE_ENTITY = 422] = \"Unprocessable Entity\";\r\nstatusTexts[statusCodes.UNSUPPORTED_MEDIA_TYPE = 415] = \"Unsupported Media Type\";\r\nstatusTexts[statusCodes.USE_PROXY = 305] = \"Use Proxy\";\r\n\r\nfunction getStatusText(statusCode) {\r\n    if (statusTexts.hasOwnProperty(statusCode)) {\r\n        return statusTexts[statusCode];\r\n    }\r\n    throw new Error(\"Status code does not exist: \" + statusCode);\r\n}\r\n\r\nfunction getStatusCode(reasonPhrase) {\r\n    for (let key in statusTexts) {\r\n        if (statusTexts[key] === reasonPhrase) {\r\n            return parseInt(key, 10);\r\n        }\r\n    }\r\n    throw new Error(\"Reason phrase does not exist: \" + reasonPhrase);\r\n}\r\n\r\n\n\n//# sourceURL=webpack:///./httpStatus.js?");

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

/***/ "./models/dto/PlayDto.js":
/*!*******************************!*\
  !*** ./models/dto/PlayDto.js ***!
  \*******************************/
/*! exports provided: PlayDto */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"PlayDto\", function() { return PlayDto; });\nclass PlayDto {\r\n\r\n    /**\r\n     * @typedef {{\r\n     *  id: Number,\r\n     *  date: {nano: Number, epochSecond: Number}\r\n     * }} JavaLitePlayDate\r\n     *\r\n     * @typedef {{\r\n     *     id: Number,\r\n     *     title: String,\r\n     *     authorName: String,\r\n     *     genreName: String,\r\n     *     dates: Array<JavaLitePlayDate>,\r\n     * }} JavaPlayDto\r\n     *\r\n     * @param dto {JavaPlayDto}\r\n     */\r\n    constructor(dto) {\r\n        this._id = dto.id;\r\n        this._title = dto.title;\r\n        this._authorName = dto.authorName;\r\n        this._genreName = dto.genreName;\r\n        this._dates = dto.dates;\r\n    }\r\n\r\n    get id() {\r\n        return this._id;\r\n    }\r\n\r\n    set id(value) {\r\n        this._id = value;\r\n    }\r\n\r\n    get title() {\r\n        return this._title;\r\n    }\r\n\r\n    set title(value) {\r\n        this._title = value;\r\n    }\r\n\r\n    get authorName() {\r\n        return this._authorName;\r\n    }\r\n\r\n    set authorName(value) {\r\n        this._authorName = value;\r\n    }\r\n\r\n    get genreName() {\r\n        return this._genreName;\r\n    }\r\n\r\n    set genreName(value) {\r\n        this._genreName = value;\r\n    }\r\n\r\n    get dates() {\r\n        return this._dates;\r\n    }\r\n\r\n    set dates(value) {\r\n        this._dates = value;\r\n    }\r\n}\n\n//# sourceURL=webpack:///./models/dto/PlayDto.js?");

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

/***/ "./models/dto/UserDto.js":
/*!*******************************!*\
  !*** ./models/dto/UserDto.js ***!
  \*******************************/
/*! exports provided: UserDto */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"UserDto\", function() { return UserDto; });\nclass UserDto {\r\n    /**\r\n     * @name JavaUserDto\r\n     * @class\r\n     * @property id {Number}\r\n     * @property email {String}\r\n     * @property phone {String}\r\n     * @property name {String}\r\n     * @property roleName {String}\r\n     */\r\n\r\n    /**\r\n     * @param dto {JavaUserDto}\r\n     */\r\n    constructor(dto) {\r\n        this._id = dto.id;\r\n        this._email = dto.email;\r\n        this._phone = dto.phone;\r\n        this._name = dto.name;\r\n        this._roleName = dto.roleName;\r\n    }\r\n\r\n    get id() {\r\n        return this._id;\r\n    }\r\n\r\n    set id(value) {\r\n        this._id = value;\r\n    }\r\n\r\n    get email() {\r\n        return this._email;\r\n    }\r\n\r\n    set email(value) {\r\n        this._email = value;\r\n    }\r\n\r\n    get phone() {\r\n        return this._phone;\r\n    }\r\n\r\n    set phone(value) {\r\n        this._phone = value;\r\n    }\r\n\r\n    get name() {\r\n        return this._name;\r\n    }\r\n\r\n    set name(value) {\r\n        this._name = value;\r\n    }\r\n\r\n    get roleName() {\r\n        return this._roleName;\r\n    }\r\n\r\n    set roleName(value) {\r\n        this._roleName = value;\r\n    }\r\n}\n\n//# sourceURL=webpack:///./models/dto/UserDto.js?");

/***/ }),

/***/ "./navigator.js":
/*!**********************!*\
  !*** ./navigator.js ***!
  \**********************/
/*! exports provided: NAVIGATOR, createRouter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"NAVIGATOR\", function() { return NAVIGATOR; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createRouter\", function() { return createRouter; });\n/* harmony import */ var _Router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Router */ \"./Router.js\");\n/* harmony import */ var _views_ErrorView__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./views/ErrorView */ \"./views/ErrorView.js\");\n/* harmony import */ var _views_ContainerView__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./views/ContainerView */ \"./views/ContainerView.js\");\n/* harmony import */ var _models_PageError__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./models/PageError */ \"./models/PageError.js\");\n/* harmony import */ var _views_SignView__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./views/SignView */ \"./views/SignView.js\");\n/* harmony import */ var _controllers_SignController__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./controllers/SignController */ \"./controllers/SignController.js\");\n/* harmony import */ var _controllers_PlayController__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./controllers/PlayController */ \"./controllers/PlayController.js\");\n/* harmony import */ var _views_PlayView__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./views/PlayView */ \"./views/PlayView.js\");\n/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./app */ \"./app.js\");\n/* harmony import */ var _controllers_ContainerController__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./controllers/ContainerController */ \"./controllers/ContainerController.js\");\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nconst NAVIGATOR = {\r\n    HOME: \"/\",\r\n    SIGN: \"/sign\",\r\n    PLAY: \"/plays/order\"\r\n};\r\n\r\nconst containerController = new _controllers_ContainerController__WEBPACK_IMPORTED_MODULE_9__[\"ContainerController\"]();\r\n\r\n/**\r\n * @param app {App}\r\n * @return {Router}\r\n */\r\nfunction createRouter(app) {\r\n\r\n    function getContainerView() {\r\n        let c = new _views_ContainerView__WEBPACK_IMPORTED_MODULE_2__[\"ContainerView\"](app.user, root);\r\n        c.setHandler(containerController);\r\n        return c;\r\n    }\r\n\r\n    const root = document.getElementById(\"wrapper\");\r\n    const router = new _Router__WEBPACK_IMPORTED_MODULE_0__[\"Router\"]({\r\n        page404: async page => {\r\n            await new _views_ErrorView__WEBPACK_IMPORTED_MODULE_1__[\"ErrorView\"](getContainerView(), _models_PageError__WEBPACK_IMPORTED_MODULE_3__[\"PageError\"].model404(page)).render();\r\n        }\r\n    });\r\n\r\n    document.body.addEventListener(\"click\", e => {\r\n        if (e.target.tagName === \"A\") {\r\n            e.preventDefault();\r\n            router.navigateTo(e.target.getAttribute(\"href\"));\r\n        }\r\n    });\r\n\r\n    router.add(NAVIGATOR.HOME, async () => {\r\n        let playView = new _views_PlayView__WEBPACK_IMPORTED_MODULE_7__[\"PlayView\"](getContainerView());\r\n        playView.setHandler(new _controllers_PlayController__WEBPACK_IMPORTED_MODULE_6__[\"PlayController\"]());\r\n        await playView.render();\r\n    });\r\n\r\n    router.add(NAVIGATOR.SIGN, async () => {\r\n        let sign = new _views_SignView__WEBPACK_IMPORTED_MODULE_4__[\"SignView\"](getContainerView());\r\n        sign.setHandler(new _controllers_SignController__WEBPACK_IMPORTED_MODULE_5__[\"SignController\"]());\r\n        await sign.render();\r\n    });\r\n\r\n    router.add(NAVIGATOR.PLAY, async (url, i) => {\r\n        console.log(url.substring(i))\r\n    });\r\n\r\n    router.startListener();\r\n    return router;\r\n}\r\n\r\n\n\n//# sourceURL=webpack:///./navigator.js?");

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
/*! exports provided: ContainerView, EVENT */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ContainerView\", function() { return ContainerView; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"EVENT\", function() { return EVENT; });\n/* harmony import */ var _View__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./View */ \"./views/View.js\");\n/* harmony import */ var _models_dto_UserDto__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/dto/UserDto */ \"./models/dto/UserDto.js\");\n/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../app */ \"./app.js\");\n\r\n\r\n\r\n\r\nclass ContainerView extends _View__WEBPACK_IMPORTED_MODULE_0__[\"View\"] {\r\n\r\n    /**\r\n     * @param model {UserDto}\r\n     * @param {HTMLElement|View} parent - content container\r\n     */\r\n    constructor(model, parent = null) {\r\n        super(parent);\r\n        this.model = model;\r\n    }\r\n\r\n    async render() {\r\n        super._render(`\r\n            <header class=\"header-menu\">\r\n                <div class=\"header-logo\">\r\n                    {HOME-PAGE}\r\n                </div>\r\n                <nav class=\"header-nav\">\r\n                    <ul class=\"header-nav-links\">\r\n                        <li><a>{Item 1}</a></li>\r\n                        <li><a>{Item 2}</a></li>\r\n                        <li><a>{Item 3}</a></li>\r\n                    </ul>   \r\n                </nav>\r\n                <div class=\"header-sign\">\r\n                    <div class=\"user-profile-menu\">\r\n                        <button class=\"sign-in-btn\">${this.model ? this.model.name : \"<a href='/sign'>Sign</a>\"}</button>\r\n                        <ul class=\"profile-menu-list\">\r\n                          <li class=\"profile-menu-item\">${_app__WEBPACK_IMPORTED_MODULE_2__[\"resources\"].strings.rootPage.profile}</li>\r\n                            <li class=\"profile-menu-item\">${_app__WEBPACK_IMPORTED_MODULE_2__[\"resources\"].strings.rootPage.basket}</li>\r\n                            <li class=\"profile-menu-item\" id=\"sign_out\">${_app__WEBPACK_IMPORTED_MODULE_2__[\"resources\"].strings.rootPage.out}</li>\r\n                        </ul>\r\n                    </div>\r\n                    <div class=\"language-selector\" id=\"lang\">\r\n                        <span class=\"language-selector-nav\">${_app__WEBPACK_IMPORTED_MODULE_2__[\"resources\"].strings.rootPage.lang}</span>\r\n                        <ul class=\"language-list\">\r\n                            <li class=\"language-item\" data-lang=\"en\">English</li>\r\n                            <li class=\"language-item\" data-lang=\"ru\">Russian</li>\r\n                        </ul>\r\n                    </div>\r\n                </div>\r\n            </header>\r\n            <div id=\"root\">\r\n        \r\n            </div>\r\n            <footer class=\"footer-menu\">\r\n                <div class=\"social-links\"></div>\r\n                <div class=\"copyright\">\r\n                    <span><span class=\"copy-sign\">&copy;</span> All right reserved</span>\r\n                </div>\r\n                <div class=\"footer-info\"></div>\r\n            </footer>`, \"#root\");\r\n        this.setupHandlers();\r\n        return this.container;\r\n    }\r\n\r\n    setupHandlers() {\r\n        let lang = document.getElementById(\"lang\");\r\n        let languageItems = lang.getElementsByClassName(\"language-item\");\r\n        for (let item of languageItems) {\r\n            if (_app__WEBPACK_IMPORTED_MODULE_2__[\"app\"].locale.includes(item.getAttribute(\"data-lang\"))) {\r\n                item.classList.add(\"selected-language\");\r\n            }\r\n            item.addEventListener(\"click\",\r\n                async (e) => this.handler.handle(EVENT.loadResource, e.target.getAttribute(\"data-lang\")));\r\n        }\r\n        this.menuHandlers();\r\n    }\r\n\r\n    menuHandlers() {\r\n        let signOut = document.getElementById(\"sign_out\");\r\n        signOut.addEventListener(\"click\", async () => this.handler.handle(EVENT.signOut));\r\n    }\r\n}\r\n\r\nconst EVENT = {\r\n    loadResource: \"res_load\",\r\n    signOut: \"app_out\"\r\n};\r\n\r\n\n\n//# sourceURL=webpack:///./views/ContainerView.js?");

/***/ }),

/***/ "./views/ErrorView.js":
/*!****************************!*\
  !*** ./views/ErrorView.js ***!
  \****************************/
/*! exports provided: ErrorView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ErrorView\", function() { return ErrorView; });\n/* harmony import */ var _View__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./View */ \"./views/View.js\");\n/* harmony import */ var _models_PageError__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/PageError */ \"./models/PageError.js\");\n\r\n\r\n\r\nclass ErrorView extends _View__WEBPACK_IMPORTED_MODULE_0__[\"View\"] {\r\n\r\n    /**\r\n     * @param {HTMLElement|View} parent - content container\r\n     * @param {PageError} model - view model\r\n     */\r\n    constructor(parent = null, model = undefined) {\r\n        super(parent);\r\n        this.model = model;\r\n    }\r\n\r\n    async render() {\r\n        return this._render(`<div id=\"notfound\">\r\n                <div class=\"notfound\">\r\n                    <div class=\"notfound-code\">\r\n                        <h1>Oops!</h1>\r\n                    </div>\r\n                    <h2>${this.model.code} - ${this.model.message}</h2>\r\n                    <p>${this.model.describe}</p>\r\n                    <a href=\"/\">Go To Homepage</a>\r\n                </div>\r\n            </div>`)\r\n    }\r\n}\n\n//# sourceURL=webpack:///./views/ErrorView.js?");

/***/ }),

/***/ "./views/PlayView.js":
/*!***************************!*\
  !*** ./views/PlayView.js ***!
  \***************************/
/*! exports provided: PlayView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"PlayView\", function() { return PlayView; });\n/* harmony import */ var _View__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./View */ \"./views/View.js\");\n/* harmony import */ var _parts_PlayItemViewPart__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./parts/PlayItemViewPart */ \"./views/parts/PlayItemViewPart.js\");\n\r\n\r\n\r\nclass PlayView extends _View__WEBPACK_IMPORTED_MODULE_0__[\"View\"] {\r\n\r\n    constructor(parent) {\r\n        super(parent);\r\n    }\r\n\r\n    async render() {\r\n        let data = await this.handler.init();\r\n        let container = await this.getContainer();\r\n        let list = container.getElementsByClassName(\"plays-list\")[0];\r\n        for (let item of data) {\r\n            list.appendChild(new _parts_PlayItemViewPart__WEBPACK_IMPORTED_MODULE_1__[\"PlayItemViewPart\"](item).htmlDom());\r\n        }\r\n        return container;\r\n    }\r\n\r\n    async getContainer() {\r\n        return this._render(`\r\n        <div class=\"plays-content-wrapper\">\r\n            <div class=\"plays-list\">\r\n            </div>\r\n        </div>`)\r\n    }\r\n}\n\n//# sourceURL=webpack:///./views/PlayView.js?");

/***/ }),

/***/ "./views/SignView.js":
/*!***************************!*\
  !*** ./views/SignView.js ***!
  \***************************/
/*! exports provided: EVENT, SignView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"EVENT\", function() { return EVENT; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"SignView\", function() { return SignView; });\n/* harmony import */ var _View__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./View */ \"./views/View.js\");\n/* harmony import */ var _models_dto_LoginDto__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/dto/LoginDto */ \"./models/dto/LoginDto.js\");\n/* harmony import */ var _models_dto_RegistrationDto__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/dto/RegistrationDto */ \"./models/dto/RegistrationDto.js\");\n/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../app */ \"./app.js\");\n\r\n\r\n\r\n\r\n\r\nclass SignView extends _View__WEBPACK_IMPORTED_MODULE_0__[\"View\"] {\r\n\r\n    /**\r\n     * @param {HTMLElement|View} parent - content container\r\n     * @param {Object=} model - view model\r\n     */\r\n    constructor(parent = null, model = undefined) {\r\n        super(parent);\r\n        this.model = model;\r\n    }\r\n\r\n    async render() {\r\n        await this._render(`\r\n            <div class=\"login-wrap\">\r\n                <div class=\"login-html\">\r\n                    <input id=\"tab-1\" type=\"radio\" name=\"tab\" class=\"sign-in\" checked><label for=\"tab-1\" class=\"tab\">Sign In</label>\r\n                    <input id=\"tab-2\" type=\"radio\" name=\"tab\" class=\"sign-up\"><label for=\"tab-2\" class=\"tab\">Sign Up</label>\r\n                    <div class=\"login-form\">\r\n                        <div class=\"sign-in-htm\">\r\n                            <div class=\"group\">\r\n                                <label for=\"s_email\" class=\"group-label\">Email</label>\r\n                                <input id=\"s_email\" type=\"text\" class=\"form-input\">\r\n                                <span class=\"error-highlight\"></span>\r\n                            </div>\r\n                            <div class=\"group\">\r\n                                <label for=\"s_pass\" class=\"group-label\">Password</label>\r\n                                <input id=\"s_pass\" type=\"password\" class=\"form-input\" data-type=\"password\">\r\n                                <span class=\"error-highlight\"></span>\r\n                            </div>\r\n                            <div class=\"group\">\r\n                                <input id=\"s_check\" type=\"checkbox\" class=\"check\" checked>\r\n                                <label for=\"s_check\"><span class=\"icon\"></span> Keep me Signed in</label>\r\n                            </div>\r\n                            <div class=\"group\">\r\n                                <input type=\"submit\" class=\"accept-form-button\" value=\"Sign In\">\r\n                            </div>\r\n                            <div class=\"hr\"></div>\r\n                            <div class=\"foot-lnk\">\r\n                                <a href=\"#\">Forgot Password?</a>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"sign-up-htm\">\r\n                            <div class=\"group\">\r\n                                <label for=\"username\" class=\"group-label\">Username</label>\r\n                                <input id=\"username\" type=\"text\" class=\"form-input\">\r\n                                <span class=\"error-highlight\"></span>\r\n                            </div>\r\n                            <div class=\"group\">\r\n                                <label for=\"email\" class=\"group-label\">Email Address</label>\r\n                                <input id=\"email\" type=\"text\" class=\"form-input\">\r\n                                <span class=\"error-highlight\"></span>\r\n                            </div>\r\n                            <div class=\"group\">\r\n                                <label for=\"phone\" class=\"group-label\">Full phone number</label>\r\n                                <input id=\"phone\" type=\"text\" class=\"form-input\">\r\n                                <span class=\"error-highlight\"></span>\r\n                            </div>\r\n                            <div class=\"group\">\r\n                                <label for=\"pass\" class=\"group-label\">Password</label>\r\n                                <input id=\"pass\" type=\"password\" class=\"form-input\" data-type=\"password\">\r\n                                <span class=\"error-highlight\"></span>\r\n                            </div>\r\n                            <div class=\"group\">\r\n                                <label for=\"repeat\" class=\"group-label\">Repeat Password</label>\r\n                                <input id=\"repeat\" type=\"password\" class=\"form-input\" data-type=\"password\">\r\n                                <span class=\"error-highlight\"></span>\r\n                            </div>\r\n                            <div class=\"group\">\r\n                                <input type=\"submit\" class=\"accept-form-button\" value=\"Sign Up\">\r\n                            </div>\r\n                            <div class=\"hr\"></div>\r\n                            <div class=\"foot-lnk\">\r\n                                <a href=\"#\">Already Member?</a>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>`);\r\n        this.setEvents();\r\n        return this.container;\r\n    }\r\n\r\n    /**\r\n     * @return {HTMLElement}\r\n     */\r\n    setEvents() {\r\n        this.registrationPasswordLiveValidator();\r\n        this.usernameLiveValidator(this.getHtmlElement(\"#username\"));\r\n        this.emailLiveValidator(this.getHtmlElement(\"#email\"));\r\n        this.phoneLiveValidator(this.getHtmlElement(\"#phone\"));\r\n        this.passwordLiveValidator(this.getHtmlElement(\"#s_pass\"));\r\n        this.emailLiveValidator(this.getHtmlElement(\"#s_email\"));\r\n\r\n        let signs = document.getElementsByClassName(\"accept-form-button\");\r\n        signs[0].addEventListener(\"click\", e => {\r\n            this.callHandler(EVENT.SIGN_IN, this.signInData(), signs[0], e);\r\n        });\r\n        signs[1].addEventListener(\"click\", e => {\r\n            this.callHandler(EVENT.SIGN_UP, this.signUpData(), signs[1], e);\r\n        });\r\n        return this.container;\r\n    }\r\n\r\n    callHandler(type, data, button, e) {\r\n        if (data) {\r\n            this.handler.handle(type, {\r\n                model: data,\r\n                event: e\r\n            }).catch(e => alert(e.message)); // TODO: show error\r\n        } else {\r\n            let color = button.style.backgroundColor;\r\n            button.disabled = true;\r\n            button.style.backgroundColor = \"red\";\r\n            setTimeout(() =>  {\r\n                button.style.backgroundColor = color;\r\n                button.disabled = false;\r\n            }, 2000);\r\n        }\r\n    }\r\n\r\n    signInData() {\r\n        try {\r\n            let dto = new _models_dto_LoginDto__WEBPACK_IMPORTED_MODULE_1__[\"LoginDto\"]();\r\n            dto.password = this.getHtmlElement(\"#s_pass\").value;\r\n            dto.email = this.getHtmlElement(\"#s_email\").value;\r\n            dto.remember = this.getHtmlElement(\"#s_check\").checked;\r\n            return dto.isValid() ? dto : null;\r\n        } catch (e) {\r\n            console.error(e);\r\n        }\r\n    }\r\n\r\n    signUpData() {\r\n        try {\r\n            let dto = new _models_dto_RegistrationDto__WEBPACK_IMPORTED_MODULE_2__[\"RegistrationDto\"]();\r\n            dto.password = this.getHtmlElement(\"#pass\").value;\r\n            dto.repeatedPassword = this.getHtmlElement(\"#repeat\").value;\r\n            dto.username = this.getHtmlElement(\"#username\").value;\r\n            dto.email = this.getHtmlElement(\"#email\").value;\r\n            dto.phone = this.getHtmlElement(\"#phone\").value;\r\n            return dto.isValid() ? dto : null;\r\n        } catch (e) {\r\n            console.error(e);\r\n        }\r\n    }\r\n\r\n    /**\r\n     * Synchronized inputs for password and for its repeated input\r\n     */\r\n    registrationPasswordLiveValidator() {\r\n        let passInput = this.getHtmlElement(\"#pass\");\r\n        passInput.addEventListener(\"input\", validator);\r\n        let repeatPassInput = this.getHtmlElement(\"#repeat\");\r\n        repeatPassInput.addEventListener(\"input\", validator);\r\n        function validator() {\r\n            if (!_app__WEBPACK_IMPORTED_MODULE_3__[\"app\"].validator.isValidPassword(passInput.value)) {\r\n                passInput.nextElementSibling.innerText = _app__WEBPACK_IMPORTED_MODULE_3__[\"app\"].values.incorrect.password;\r\n            } else {\r\n                passInput.nextElementSibling.innerText = \"\";\r\n            }\r\n            if (passInput.value !== repeatPassInput.value) {\r\n                repeatPassInput.nextElementSibling.innerText = _app__WEBPACK_IMPORTED_MODULE_3__[\"app\"].values.incorrect.repeated_password;\r\n            } else {\r\n                repeatPassInput.nextElementSibling.innerText = \"\";\r\n            }\r\n        }\r\n    }\r\n\r\n    /**\r\n     * @param input - html element <input />\r\n     * @return input\r\n     */\r\n    usernameLiveValidator(input) {\r\n        this.setupLiveValidator(input, _app__WEBPACK_IMPORTED_MODULE_3__[\"app\"].values.incorrect.username,\r\n                str => _app__WEBPACK_IMPORTED_MODULE_3__[\"app\"].validator.isValidUsername(str))\r\n    }\r\n\r\n    /**\r\n     * @param input - html element <input />\r\n     * @return input\r\n     */\r\n    passwordLiveValidator(input) {\r\n        this.setupLiveValidator(input, _app__WEBPACK_IMPORTED_MODULE_3__[\"app\"].values.incorrect.password,\r\n                str => _app__WEBPACK_IMPORTED_MODULE_3__[\"app\"].validator.isValidPassword(str))\r\n    }\r\n\r\n    /**\r\n     * @param input - html element <input />\r\n     * @return input\r\n     */\r\n    emailLiveValidator(input) {\r\n        this.setupLiveValidator(input, _app__WEBPACK_IMPORTED_MODULE_3__[\"app\"].values.incorrect.email,\r\n                str => _app__WEBPACK_IMPORTED_MODULE_3__[\"app\"].validator.isValidEmail(str))\r\n    }\r\n\r\n    /**\r\n     * @param input - html element <input />\r\n     * @return input\r\n     */\r\n    phoneLiveValidator(input) {\r\n        this.setupLiveValidator(input, _app__WEBPACK_IMPORTED_MODULE_3__[\"app\"].values.incorrect.phone,\r\n                str => _app__WEBPACK_IMPORTED_MODULE_3__[\"app\"].validator.isValidPhoneNumber(str))\r\n    }\r\n\r\n    /**\r\n     * Predicate function with one parameter\r\n     * @param item {*}\r\n     * @return {boolean}\r\n     * @callback predicateFunc\r\n     */\r\n\r\n    /**\r\n     * Setup listener for input\r\n     * @param input - html element <input />\r\n     * @param errorMessage {String} - error message, tip for user\r\n     * @param predicate {predicateFunc}\r\n     * @return input\r\n     */\r\n    setupLiveValidator(input, errorMessage, predicate) {\r\n        input.addEventListener(\"input\", _ => {\r\n            if (!predicate(input.value)) {\r\n                input.nextElementSibling.innerText = errorMessage;\r\n            } else {\r\n                input.nextElementSibling.innerText = \"\";\r\n            }\r\n        });\r\n        return input;\r\n    }\r\n}\r\n\r\nconst EVENT = {\r\n    SIGN_UP: \"up\",\r\n    SIGN_IN: \"in\"\r\n};\r\n\r\n\n\n//# sourceURL=webpack:///./views/SignView.js?");

/***/ }),

/***/ "./views/View.js":
/*!***********************!*\
  !*** ./views/View.js ***!
  \***********************/
/*! exports provided: View */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"View\", function() { return View; });\n/* harmony import */ var _controllers_Controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../controllers/Controller */ \"./controllers/Controller.js\");\n/**\r\n * All view must be override all methods\r\n */\r\n\r\n\r\nclass View {\r\n\r\n    /**\r\n     * @param {HTMLElement|View} parent - content container\r\n     */\r\n    constructor(parent= null) {\r\n        this.container = null;\r\n        this.parent = parent;\r\n        /**\r\n         * @type {Controller}\r\n         */\r\n        this.handler = null;\r\n        /**\r\n         * @type {Map<String, HTMLElement>}\r\n         * @private\r\n         */\r\n        this._htmlCache = new Map();\r\n    }\r\n\r\n    /**\r\n     * Method to override\r\n     * @return {Promise<HTMLElement>} - content container\r\n     */\r\n    async render() {\r\n        throw new Error(\"Render wasn't override\");\r\n    }\r\n\r\n    /**\r\n     * Method to override, set event handler on view\r\n     * @param handler {Controller}\r\n     */\r\n    setHandler(handler) {\r\n        this.handler = handler;\r\n    }\r\n\r\n    /**\r\n     * Find and cache html element inside current container (if it's class return first in DOM)\r\n     * @param selector {String} - id or class selector for child container\r\n     * @return HTMLElement\r\n     */\r\n    getHtmlElement(selector) {\r\n        if (this.container) {\r\n            let element = this._htmlCache.get(selector);\r\n            if (!element) {\r\n                element = this._getElementBySelector(this.container, selector);\r\n                this._htmlCache.set(selector, element);\r\n            }\r\n            return element;\r\n        }\r\n    }\r\n\r\n    /**\r\n     * Insert {html} code into parent block\r\n     * @param html {String} - html code\r\n     * @param root {String=} - id or class selector for child container\r\n     * @return {HTMLElement} - container if view rendered itself, otherwise view's html string\r\n     * @protected\r\n     */\r\n    async _render(html, root = undefined) {\r\n        let container = this.parent instanceof View ? await this.parent.render() : this.parent;\r\n        container.innerHTML = html;\r\n        if (root) {\r\n            container = this._getElementBySelector(container, root);\r\n            if (!container) {\r\n                throw new Error(`Selector ${root} not found (it's should be id or class)`);\r\n            }\r\n        }\r\n        return (this.container = container);\r\n    }\r\n\r\n    /**\r\n     * Find html element inside container (if it's class return first in DOM)\r\n     * @param container - container for search\r\n     * @param selector - selector class or id\r\n     * @return {HTMLElement}\r\n     * @private\r\n     */\r\n    _getElementBySelector(container, selector) {\r\n        return selector.startsWith(\"#\") ? document.getElementById(selector.substring(1)) :\r\n            (selector.startsWith(\".\") ? container.getElementsByClassName(selector.substring(1))[0] : undefined);\r\n    }\r\n}\n\n//# sourceURL=webpack:///./views/View.js?");

/***/ }),

/***/ "./views/parts/PlayItemViewPart.js":
/*!*****************************************!*\
  !*** ./views/parts/PlayItemViewPart.js ***!
  \*****************************************/
/*! exports provided: PlayItemViewPart */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"PlayItemViewPart\", function() { return PlayItemViewPart; });\n/* harmony import */ var _models_dto_PlayDto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../models/dto/PlayDto */ \"./models/dto/PlayDto.js\");\n/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../app */ \"./app.js\");\n/* harmony import */ var _navigator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../navigator */ \"./navigator.js\");\n\r\n\r\n\r\n\r\nclass PlayItemViewPart {\r\n\r\n    /**\r\n     * @param model {PlayDto}\r\n     */\r\n    constructor(model) {\r\n        this.model = model;\r\n    }\r\n\r\n    /**\r\n     * @return {HTMLDivElement}\r\n     */\r\n    htmlDom() {\r\n        let div = document.createElement(\"div\");\r\n        div.classList.add(\"play-item\");\r\n        this.fill(div);\r\n        return div;\r\n    }\r\n\r\n    /**\r\n     * @param div {HTMLDivElement}\r\n     */\r\n    fill(div) {\r\n        div.innerHTML = `\r\n                    <div class=\"play-info\">\r\n                        <h3 class=\"play-title\">${this.model.title}</h3>\r\n                        <p class=\"play-author\">\r\n                            <span class=\"h-name\">${_app__WEBPACK_IMPORTED_MODULE_1__[\"resources\"].strings.playPage.author}:</span>\r\n                            <span class=\"h-item\">${this.model.authorName}</span>\r\n                        </p>\r\n                        <p class=\"play-genre\">\r\n                            <span class=\"h-name\">${_app__WEBPACK_IMPORTED_MODULE_1__[\"resources\"].strings.playPage.genre}:</span>\r\n                            <span class=\"h-item\">${this.model.genreName}</span>\r\n                        </p>\r\n                    </div>\r\n                    <div class=\"play-dates\">\r\n                        <ul class=\"play-dates-list\">\r\n                            <li>${_app__WEBPACK_IMPORTED_MODULE_1__[\"resources\"].strings.playPage.dates}:</li>\r\n                            ${this.playDatesListRender()}\r\n                        </ul>\r\n                    </div>`;\r\n    }\r\n\r\n    playDatesListRender() {\r\n        let html = [];\r\n        for (let item of this.model.dates) {\r\n            let d = new Date(item.date.epochSecond * 1000).toLocaleString(_app__WEBPACK_IMPORTED_MODULE_1__[\"app\"].locale);\r\n            html.push(`<li class=\"play-date\"><a href=\"${_navigator__WEBPACK_IMPORTED_MODULE_2__[\"NAVIGATOR\"].PLAY}?id=${this.model.id}&date=${item.id}\">${d}</a></li>`);\r\n        }\r\n        return html.join(\"\\n\");\r\n    }\r\n}\n\n//# sourceURL=webpack:///./views/parts/PlayItemViewPart.js?");

/***/ })

/******/ });