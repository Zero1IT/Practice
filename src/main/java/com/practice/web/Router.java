package com.practice.web;

import com.practice.web.config.*;
import com.practice.web.config.security.Authorize;
import com.practice.web.config.security.WebAuthorize;
import com.practice.web.dto.JwtPayload;
import com.practice.web.utils.JsonUtils;
import com.practice.web.utils.WebUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.AnnotatedElement;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;

/**
 * WebController value is more important !!!
 * Between {first} WebController("/api")
 * and {second} WebController("/") with WebRequest("/api")
 * by request "/api" will be selected {first}
 *
 * All "GET request" parameters passed to the controller as strings.
 * Parameter name should be equal "GET" parameter name
 */
public class Router implements RequestResolver {

    private static final Logger LOGGER = LogManager.getLogger(Router.class);

    private final Map<String, Handler> handlers = new HashMap<>();
    private final boolean isAutoResolveNotFound;
    private final WebAuthorize<JwtPayload> auth;

    public Router(boolean isAutoResolveNotFound) {
        this(isAutoResolveNotFound, null);
    }

    public Router(boolean isAutoResolveNotFound, WebAuthorize<JwtPayload> auth) {
        this.isAutoResolveNotFound = isAutoResolveNotFound;
        this.auth = auth;
    }

    @Override
    public void resolve(HttpServletRequest req, HttpServletResponse resp) throws IOException, NotFoundRouteException {
        String methodType = req.getMethod();
        String uri = removeEndSlash(req.getRequestURI());
        String pattern = handlers.keySet().stream()
                .filter(uri::startsWith)
                .max(Comparator.comparingInt(String::length))
                .orElse(null);

        if (pattern == null) {
            if (isAutoResolveNotFound) {
                resp.sendError(HttpServletResponse.SC_NOT_FOUND);
                return;
            }
            throw new NotFoundRouteException(uri);
        }

        Handler handler = handlers.get(pattern);
        if (!preventAccess(req, resp, handler.getControllerClass())) {
            invokeMethod(handler, uri, methodType, req, resp);
        }
    }

    private boolean preventAccess(HttpServletRequest req, HttpServletResponse resp, AnnotatedElement element) throws IOException {
        if (auth != null && element.isAnnotationPresent(Authorize.class)) {
            if (auth.allowAccess(req, resp, element.getAnnotation(Authorize.class))) {
                return false;
            } else {
                resp.sendError(HttpServletResponse.SC_UNAUTHORIZED);
                return true;
            }
        }
        return false;
    }

    private void invokeMethod(Handler handler, String url, String method, HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            if (!handler.invoke(url, method, req, resp) && !resp.isCommitted()) {
                resp.sendError(HttpServletResponse.SC_NOT_IMPLEMENTED, "http.method_not_implemented");
            }
        } catch (InvocationTargetException e) {
            LOGGER.error(e.getMessage());
            handleError(resp, e);
        } catch (IllegalAccessException e) {
            LOGGER.error(e);
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "O-ops -_- What's wrong?");
        }
    }

    private void handleError(HttpServletResponse resp, InvocationTargetException e) throws IOException {
        if (e.getCause() instanceof RequestException) {
            resp.sendError(((RequestException) e.getCause()).getCode(), e.getCause().getMessage());
        } else {
            e.printStackTrace();
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Unknown server error");
        }
    }

    @Override
    public void addMapping(Object controller) {
        String controllerUrl = ejectControllerUrl(controller);
        checkUrlFormat(controllerUrl);
        handlers.put(controllerUrl, new Handler(controller));
    }

    private String ejectControllerUrl(Object controller) {
        Class<?> cl = controller.getClass();
        WebController annotation = cl.getAnnotation(WebController.class);
        String result;

        if (annotation != null) {
            result = removeEndSlash(annotation.value());
        } else {
            throw new IllegalArgumentException("Controller must be annotated with @WebController");
        }

        return result;
    }

    private class Handler {
        private final Map<String, Method> methodMap = new HashMap<>();
        private final Object controller;

        public Handler(Object controller) {
            this.controller = controller;
            ejectControllerMethodsMap();
        }

        public Class<?> getControllerClass() {
            return controller.getClass();
        }

        /**
         * Invokes method of controller if exists
         * @param url - request url
         * @param method - http method name
         * @param request - http request
         * @param response - http response
         * @return true if method is invoked, otherwise false
         * @throws InvocationTargetException - cannot invoke method
         * @throws IllegalAccessException - method is not public
         */
        public boolean invoke(String url, String method, HttpServletRequest request, HttpServletResponse response)
                throws InvocationTargetException, IllegalAccessException, IOException {
            Method methodToInvoke = methodMap.entrySet().stream()
                    .filter(it -> isRightMethod(url, method, it))
                    .max(Comparator.comparingInt(entry -> entry.getKey().length()))
                    .map(Map.Entry::getValue)
                    .orElse(null);

            if (methodToInvoke == null || preventAccess(request, response, methodToInvoke)) {
                return false;
            }

            Object[] args = getMethodArguments(methodToInvoke, request, response);
            Class<?> returnType = methodToInvoke.getReturnType();
            Object result = methodToInvoke.invoke(controller, args);
            if (returnType.equals(String.class)) {
                try (PrintWriter writer = response.getWriter()) {
                    writer.write((String)result);
                }
            } else if (!returnType.equals(Void.TYPE)) {
                WebUtils.sendJsonResponse(response, JsonUtils.toJson(result));
            }
            LOGGER.info(response.isCommitted());
            return true;
        }

        private Object[] getMethodArguments(Method method, HttpServletRequest req, HttpServletResponse resp) {
            Parameter[] parameters = method.getParameters();
            Object[] args = new Object[parameters.length];

            if (parameters.length == 0)
                return args;

            Object param;
            Map<Class<?>, Object> map = new HashMap<>();
            map.put(HttpServletRequest.class, req);
            map.put(HttpServletResponse.class, resp);

            // if doesn't exists, ejects NULL for param
            for (int i = 0; i < parameters.length; i++) {
                if (parameters[i].getType().equals(JwtPayload.class) && auth != null) {
                    args[i] = auth.getAuthentication(req, resp);
                } else {
                    param = map.get(parameters[i].getType());
                    args[i] = param == null ? ejectGetParameter(req, parameters[i]) : param;
                }
            }

            return args;
        }

        private String ejectGetParameter(HttpServletRequest req, Parameter methodParameter) {
            WebParam param = methodParameter.getAnnotation(WebParam.class);
            return param != null ? req.getParameter(param.value()) : null;
        }

        private boolean isRightMethod(String url, String method, Map.Entry<String, Method> entry) {
            WebRequest annotation = entry.getValue().getAnnotation(WebRequest.class);
            return url.endsWith(entry.getKey()) && annotation.method().isMethod(method);
        }

        private void ejectControllerMethodsMap() {
            Method[] methods = Arrays.stream(controller.getClass().getDeclaredMethods())
                    .filter(method -> method.isAnnotationPresent(WebRequest.class))
                    .toArray(Method[]::new);

            for (Method method : methods) {
                String value = method.getAnnotation(WebRequest.class).value();
                value = removeEndSlash(value);
                checkUrlFormat(value);
                if (methodMap.containsKey(value)) {
                    String m = "Duplicate handler url \"" + value + "\" for controller - " + controller.getClass();
                    throw new IllegalArgumentException(m);
                }
                methodMap.put(value, method);
            }
        }
    }

    private static void checkUrlFormat(String value) {
        if (value.length() > 1 && !value.startsWith("/")) {
            throw new IllegalArgumentException("WebRequest value should start with /: " + value);
        }
    }

    private static String removeEndSlash(String str) {
        return str.replaceAll("/+$", "");
    }
}
