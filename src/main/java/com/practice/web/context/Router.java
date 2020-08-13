package com.practice.web.context;

import com.practice.web.context.security.Authorize;
import com.practice.web.context.security.WebAuthorize;
import com.practice.web.controllers.Controller;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.reflect.AnnotatedElement;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

public class Router implements RequestResolver {

    private static final Logger LOGGER = LogManager.getLogger(Router.class);

    private final Map<String, Controller> handlers = new HashMap<>();
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
        String uri = req.getRequestURI();
        Controller controller = handlers.get(uri);

        if (controller == null) {
            if (isAutoResolveNotFound) {
                resp.sendError(HttpServletResponse.SC_NOT_FOUND);
                return;
            }
            throw new NotFoundRouteException(uri);
        }

        if (auth == null || checkAuthorizeAccess(req, resp, controller.getClass())) {
            invokeMethod(req, resp, methodType, controller);
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

    private void invokeMethod(HttpServletRequest req, HttpServletResponse resp, String methodType, Controller controller) throws IOException {
        try {
            Class<? extends Controller> cl = controller.getClass();
            Method method = cl.getMethod(methodType.toLowerCase(), HttpServletRequest.class, HttpServletResponse.class);
            if (checkAuthorizeAccess(req, resp, method)) {
                method.invoke(controller, req, resp);
            }
        } catch (NoSuchMethodException e) {
            resp.sendError(HttpServletResponse.SC_NOT_IMPLEMENTED, "http.method_not_implemented");
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
    public void addMapping(Controller controller) {
        for (String s : ejectUrls(controller)) {
            handlers.put(s, controller);
        }
    }

    private String[] ejectUrls(Object controller) {
        Class<?> cl = controller.getClass();
        WebController annotation = cl.getAnnotation(WebController.class);
        String[] result;

        if (annotation != null) {
            result = annotation.value();
        } else {
            throw new IllegalArgumentException("Controller must be annotated with @WebController");
        }

        return result;
    }
}
