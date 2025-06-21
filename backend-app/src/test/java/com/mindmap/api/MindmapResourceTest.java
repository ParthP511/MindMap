package com.mindmap.api;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;

@QuarkusTest
class MindmapResourceTest {
    @Test
    void testHelloEndpoint() {
        given()
          .when().get("/api/mindmap")
          .then()
             .statusCode(200)
             .contentType("application/json")
             .body("size()", is(0));    // This may change, and when it does the test needs to be updated.
    }

}