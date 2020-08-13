/**
 * Author: https://github.com/prettymuchbryce/http-status-codes
 */

const statusCodes = {};
const statusTexts = {};

statusTexts[statusCodes.ACCEPTED = 202] = "Accepted";
statusTexts[statusCodes.BAD_GATEWAY = 502] = "Bad Gateway";
statusTexts[statusCodes.BAD_REQUEST = 400] = "Bad Request";
statusTexts[statusCodes.CONFLICT = 409] = "Conflict";
statusTexts[statusCodes.CONTINUE = 100] = "Continue";
statusTexts[statusCodes.CREATED = 201] = "Created";
statusTexts[statusCodes.EXPECTATION_FAILED = 417] = "Expectation Failed";
statusTexts[statusCodes.FAILED_DEPENDENCY  = 424] = "Failed Dependency";
statusTexts[statusCodes.FORBIDDEN = 403] = "Forbidden";
statusTexts[statusCodes.GATEWAY_TIMEOUT = 504] = "Gateway Timeout";
statusTexts[statusCodes.GONE = 410] = "Gone";
statusTexts[statusCodes.HTTP_VERSION_NOT_SUPPORTED = 505] = "HTTP Version Not Supported";
statusTexts[statusCodes.IM_A_TEAPOT = 418] = "I'm a teapot";
statusTexts[statusCodes.INSUFFICIENT_SPACE_ON_RESOURCE = 419] = "Insufficient Space on Resource";
statusTexts[statusCodes.INSUFFICIENT_STORAGE = 507] = "Insufficient Storage";
statusTexts[statusCodes.INTERNAL_SERVER_ERROR = 500] = "Server Error";
statusTexts[statusCodes.LENGTH_REQUIRED = 411] = "Length Required";
statusTexts[statusCodes.LOCKED = 423] = "Locked";
statusTexts[statusCodes.METHOD_FAILURE = 420] = "Method Failure";
statusTexts[statusCodes.METHOD_NOT_ALLOWED = 405] = "Method Not Allowed";
statusTexts[statusCodes.MOVED_PERMANENTLY = 301] = "Moved Permanently";
statusTexts[statusCodes.MOVED_TEMPORARILY = 302] = "Moved Temporarily";
statusTexts[statusCodes.MULTI_STATUS = 207] = "Multi-Status";
statusTexts[statusCodes.MULTIPLE_CHOICES = 300] = "Multiple Choices";
statusTexts[statusCodes.NETWORK_AUTHENTICATION_REQUIRED = 511] = "Network Authentication Required";
statusTexts[statusCodes.NO_CONTENT = 204] = "No Content";
statusTexts[statusCodes.NON_AUTHORITATIVE_INFORMATION = 203] = "Non Authoritative Information";
statusTexts[statusCodes.NOT_ACCEPTABLE = 406] = "Not Acceptable";
statusTexts[statusCodes.NOT_FOUND = 404] = "Not Found";
statusTexts[statusCodes.NOT_IMPLEMENTED = 501] = "Not Implemented";
statusTexts[statusCodes.NOT_MODIFIED = 304] = "Not Modified";
statusTexts[statusCodes.OK = 200] = "OK";
statusTexts[statusCodes.PARTIAL_CONTENT = 206] = "Partial Content";
statusTexts[statusCodes.PAYMENT_REQUIRED = 402] = "Payment Required";
statusTexts[statusCodes.PERMANENT_REDIRECT = 308] = "Permanent Redirect";
statusTexts[statusCodes.PRECONDITION_FAILED = 412] = "Precondition Failed";
statusTexts[statusCodes.PRECONDITION_REQUIRED = 428] = "Precondition Required";
statusTexts[statusCodes.PROCESSING = 102] = "Processing";
statusTexts[statusCodes.PROXY_AUTHENTICATION_REQUIRED = 407] = "Proxy Authentication Required";
statusTexts[statusCodes.REQUEST_HEADER_FIELDS_TOO_LARGE = 431] = "Request Header Fields Too Large";
statusTexts[statusCodes.REQUEST_TIMEOUT = 408] = "Request Timeout";
statusTexts[statusCodes.REQUEST_TOO_LONG = 413] = "Request Entity Too Large";
statusTexts[statusCodes.REQUEST_URI_TOO_LONG = 414] = "Request-URI Too Long";
statusTexts[statusCodes.REQUESTED_RANGE_NOT_SATISFIABLE = 416] = "Requested Range Not Satisfiable";
statusTexts[statusCodes.RESET_CONTENT = 205] = "Reset Content";
statusTexts[statusCodes.SEE_OTHER = 303] = "See Other";
statusTexts[statusCodes.SERVICE_UNAVAILABLE = 503] = "Service Unavailable";
statusTexts[statusCodes.SWITCHING_PROTOCOLS = 101] = "Switching Protocols";
statusTexts[statusCodes.TEMPORARY_REDIRECT = 307] = "Temporary Redirect";
statusTexts[statusCodes.TOO_MANY_REQUESTS = 429] = "Too Many Requests";
statusTexts[statusCodes.UNAUTHORIZED = 401] = "Unauthorized";
statusTexts[statusCodes.UNPROCESSABLE_ENTITY = 422] = "Unprocessable Entity";
statusTexts[statusCodes.UNSUPPORTED_MEDIA_TYPE = 415] = "Unsupported Media Type";
statusTexts[statusCodes.USE_PROXY = 305] = "Use Proxy";

function getStatusText(statusCode) {
    if (statusTexts.hasOwnProperty(statusCode)) {
        return statusTexts[statusCode];
    }
    throw new Error("Status code does not exist: " + statusCode);
}

function getStatusCode(reasonPhrase) {
    for (let key in statusTexts) {
        if (statusTexts[key] === reasonPhrase) {
            return parseInt(key, 10);
        }
    }
    throw new Error("Reason phrase does not exist: " + reasonPhrase);
}

export {
    getStatusCode,
    getStatusText,
    statusTexts,
    statusCodes
}