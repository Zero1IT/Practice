package com.practice.web;

import com.practice.web.config.NotFoundRouteException;
import com.practice.web.config.WebController;
import com.practice.web.config.WebRequest;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.reflect.Proxy;
import java.time.Instant;
import java.util.Arrays;

class RouterTest {

    private final Router router = new Router(true);
    private final HttpServletResponse resp = mockResponse();
    private final OneController one = new OneController();
    private final TwoController two = new TwoController();
    private final ThreeController three = new ThreeController();

    {
        router.addMapping(one);
        router.addMapping(two);
        router.addMapping(three);
    }

    @Test
    void shouldBeInvoked1() throws IOException, NotFoundRouteException {
        HttpServletRequest req = mockRequest("/one");
        router.resolve(req, resp);
        Assertions.assertEquals("/one", two.message1);
    }

    @Test
    void shouldBeInvoked2() throws IOException, NotFoundRouteException {
        HttpServletRequest req = mockRequest("/test/one");
        router.resolve(req, resp);
        Assertions.assertEquals("/test/one", one.message1);
    }

    @Test
    void shouldBeInvoked3() throws IOException, NotFoundRouteException, InterruptedException {
        HttpServletRequest req = mockRequest("/test");
        router.resolve(req, resp);
        Assertions.assertEquals("/test/", one.message2);
    }

    @Test
    void shouldBeInvoked4() throws IOException, NotFoundRouteException, InterruptedException {
        HttpServletRequest req = mockRequest("/api");
        router.resolve(req, resp);
        Assertions.assertEquals("/api", three.message1);
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
            message2 = "/test/";
        }
    }

    @WebController("/")
    static class TwoController {
        private String message1;
        private String message2;
        private String message3;
        @WebRequest("/one")
        void one(HttpServletRequest req, HttpServletResponse resp) {
            message1 = "/one";
        }
        @WebRequest("/test")
        void two(HttpServletRequest req, HttpServletResponse resp) {
            message2 = "/test";
        }
        @WebRequest("/api")
        void three(HttpServletRequest req, HttpServletResponse resp) {
            message3 = "three - /test";
        }
    }

    @WebController("/api")
    static class ThreeController {
        private String message1;
        @WebRequest
        void one(HttpServletRequest req, HttpServletResponse resp) {
            message1 = "/api";
        }
    }

    static HttpServletRequest mockRequest(String uri) {
        return (HttpServletRequest) Proxy.newProxyInstance(
                ClassLoader.getSystemClassLoader(),
                new Class<?>[] {HttpServletRequest.class},
                (proxy, method, args) -> {
                    if (method.getName().equals("getMethod")) {
                        return "GET";
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
