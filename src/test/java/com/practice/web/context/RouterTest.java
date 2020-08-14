package com.practice.web.context;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.reflect.Proxy;
import java.util.Arrays;

class RouterTest {

    private final Router router = new Router(true);
    private final HttpServletResponse resp = mockResponse();
    private final OneController one = new OneController();
    private final TwoController two = new TwoController();

    {
        System.out.println("CREATE");
        router.addMapping(one);
        router.addMapping(two);
    }

    @Test
    void shouldBeInvoked1() throws IOException, NotFoundRouteException {
        HttpServletRequest req = mockRequest("GET", "/one");
        router.resolve(req, resp);
        Assertions.assertEquals("/one", two.message1);
    }

    @Test
    void shouldBeInvoked2() throws IOException, NotFoundRouteException {
        HttpServletRequest req = mockRequest("GET", "/test/one");
        router.resolve(req, resp);
        Assertions.assertEquals("/test/one", one.message1);
    }

    @Test
    void shouldBeInvoked3() throws IOException, NotFoundRouteException, InterruptedException {
        HttpServletRequest req = mockRequest("GET", "/test");
        router.resolve(req, resp);
        Assertions.assertEquals("/test/", one.message2);
    }

    @WebController("/test")
    static class OneController {
        private String message1;
        private String message2;
        @WebRequest("/one")
        void one(HttpServletRequest req, HttpServletResponse resp) {
            message1 = "/test/one";
        }
        @WebRequest
        void two(HttpServletRequest req, HttpServletResponse resp) {
            System.out.println("SET");
            message2 = "/test/";
        }
    }

    @WebController("/")
    static class TwoController {
        private String message1;
        private String message2;
        @WebRequest("/one")
        void one(HttpServletRequest req, HttpServletResponse resp) {
            message1 = "/one";
        }
        @WebRequest("/test")
        void two(HttpServletRequest req, HttpServletResponse resp) {
            message2 = "/test";
        }
    }

    static HttpServletRequest mockRequest(String methodName, String uri) {
        return (HttpServletRequest) Proxy.newProxyInstance(
                ClassLoader.getSystemClassLoader(),
                new Class<?>[] {HttpServletRequest.class},
                (proxy, method, args) -> {
                    if (method.getName().equals("getMethod")) {
                        return methodName;
                    } else if (method.getName().equals("getRequestURI")) {
                        return uri;
                    }
                    return proxy;
                }
        );
    }

    static HttpServletResponse mockResponse() {
        return (HttpServletResponse) Proxy.newProxyInstance(
                ClassLoader.getSystemClassLoader(),
                new Class<?>[] {HttpServletResponse.class},
                (proxy, method, args) -> {
                    System.out.println(method + ": " + Arrays.toString(args));
                    return proxy;
                }
        );
    }
}
