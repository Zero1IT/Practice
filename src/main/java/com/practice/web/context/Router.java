package com.practice.web.context;

import com.practice.web.context.security.Authorize;
import com.practice.web.context.security.WebAuthorize;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.reflect.AnnotatedElement;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;

public class Router implements RequestResolver {

    private static final Logger LOGGER = LogManager.getLogger(Router.class);

    private final Map<String, Handler> handlers = new HashMap<>();
    private final boolean isAutoResolveNotFound;
    private final WebAuthorize auth;


    public Router(boolean isAutoResolveNotFound) {
        this(isAutoResolveNotFound, null);
    }

    public Router(boolean isAutoResolveNotFound, WebAuthorize auth) {
        this.isAutoResolveNotFound = isAutoResolveNotFound;
        this.auth = auth;
    }

    @Override
    public void resolve(HttpServletRequest req, HttpServletResponse resp) throws IOException, NotFoundRouteException {
        String methodType = req.getMethod();
        String uri = removeEndSlash(req.getRequestURI());
        String[] patternsSelected = handlers.keySet().stream()
                .filter(uri::startsWith)
                .toArray(String[]::new);
        String pattern = null;

        if (patternsSelected.length > 1) {
            pattern = Arrays.stream(patternsSelected)
                    .max(Comparator.comparingInt(String::length))
                    .orElse(null);
        } else if (patternsSelected.length == 1) {
            pattern = patternsSelected[0];
        }

        if (pattern == null) {
            if (isAutoResolveNotFound) {
                resp.sendError(HttpServletResponse.SC_NOT_FOUND);
                return;
            }
            throw new NotFoundRouteException(uri);
        }

        Handler handler = handlers.get(pattern);
        if (auth == null || checkAuthorizeAccess(req, resp, handler.getControllerClass())) {
            invokeMethod(handler, uri, methodType, req, resp);
        }
    }

    private boolean checkAuthorizeAccess(HttpServletRequest req, HttpServletResponse resp, AnnotatedElement element) throws IOException {
        if (auth != null && element.isAnnotationPresent(Authorize.class)) {
            if (auth.allowAccess(req, resp, element.getAnnotation(Authorize.class))) {
                return true;
            } else {
                resp.sendError(HttpServletResponse.SC_UNAUTHORIZED);
                return false;
            }
        }
        return true;
    }

    private void invokeMethod(Handler handler, String url, String method, HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            if (!handler.invoke(url, method, req, resp)) {
                resp.sendError(HttpServletResponse.SC_NOT_IMPLEMENTED, "http.method_not_implemented");
            }
        } catch (InvocationTargetException e) {
            LOGGER.error(e.getCause());
            if (e.getCause() instanceof RequestException) {
                resp.sendError(((RequestException) e.getCause()).getCode(), e.getCause().getMessage());
            } else {
                resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Unknown server error");
            }
        } catch (IllegalAccessException e) {
            LOGGER.error(e);
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "O-ops -_- What's wrong?");
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
            result = annotation.value();
        } else {
            throw new IllegalArgumentException("Controller must be annotated with @WebController");
        }

        return result;
    }

    private static class Handler {
        private final Map<String, Method> methodMap = new HashMap<>();
        private final Object controller;

        public Handler(Object controller) {
            this.controller = controller;
            ejectControllerMethodsMap();
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
        public boolean invoke(String url, String method, HttpServletRequest request, HttpServletResponse response) throws InvocationTargetException, IllegalAccessException {
            Method[] methods = methodMap.entrySet().stream()
                    .filter(it -> isRightMethod(url, method, it))
                    .map(Map.Entry::getValue)
                    .toArray(Method[]::new);
            Method methodToInvoke = null;
            if (methods.length > 1) {
                methodToInvoke = Arrays.stream(methods)
                        .max(Comparator.comparingInt(o -> o.getName().length()))
                        .orElse(null);
            } else if (methods.length == 1) {
                methodToInvoke = methods[0];
            }

            if (methodToInvoke == null) {
                return false;
            }

            LOGGER.debug(methodToInvoke);
            methodToInvoke.invoke(controller, request, response);
            return true;
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
                boolean isCorrectParams = Arrays.equals(method.getParameterTypes(),
                        new Class<?>[]{ HttpServletRequest.class, HttpServletResponse.class });
                if (!isCorrectParams) {
                    throw new IllegalArgumentException("Controller haven't got params HttpServletRequest and HttpServletResponse");
                }
                String value = method.getAnnotation(WebRequest.class).value();
                value = removeEndSlash(value);
                checkUrlFormat(value);
                methodMap.put(value, method);
            }
        }

        public Class<?> getControllerClass() {
            return controller.getClass();
        }
    }

    private static void checkUrlFormat(String value) {
        if (value.length() > 1 && !value.startsWith("/")) {
            throw new IllegalArgumentException("WebRequest value should start with /: " + value);
        }
    }

    private static String removeEndSlash(String str) {
        if (str.length() < 2) {
            return str;
        }
        return str.endsWith("/") ? str.substring(0, str.length() - 1) : str;
    }
}
