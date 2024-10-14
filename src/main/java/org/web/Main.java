package org.web;

import java.nio.charset.StandardCharsets;
import java.util.Locale;

import com.fastcgi.FCGIInterface;


public class Main {
    private static final String OK_CODE = "HTTP/2 200 OK\n";
    private static final String ERR_CODE = "HTTP/2 400 Bad Request\n";
    private static final String RES_STRING = "{\"result\": %b, %s}";
    private static final String RESPONSE_TEMPLATE = """
            Content-Type: application/json
            Access-Control-Allow-Origin: *
            Content-Length: %d

            %s""";

    public static void main(String[] args) {
        while (new FCGIInterface().FCGIaccept() >= 0) {
            String type = FCGIInterface.request.params.getProperty("REQUEST_METHOD");
            String data = FCGIInterface.request.params.getProperty("QUERY_STRING");


            try {
                if(!type.equals("POST")) throw new IllegalStateException();

                Coordinates coord = Coordinates.parser(data);

                coord.validate();

                sendJsonOK(String.format(Locale.US, RES_STRING,
                coord.checkArea(), coord.getPars()));


            } catch (IllegalStateException e) {
                sendJsonErr("{\"error\": \"wrong query type\"}");
            } catch (NumberFormatException e) {
                sendJsonErr("{\"error\": \"wrong query param type\"}");
            } catch (IllegalArgumentException e) {
                sendJsonErr("{\"error\": \"wrong query param values\"}");
            } catch (NullPointerException e) {
                sendJsonErr("{\"error\": \"missed necessary query param\"}");
            } catch (Exception e) {
                sendJsonErr(String.format("{\"error\": %s}", e));
            }
        }
    }

    private static void sendJsonOK(String data) {
        System.out.printf(OK_CODE + (RESPONSE_TEMPLATE) + "%n", data.getBytes(StandardCharsets.UTF_8).length, data);
    }

    private static void sendJsonErr(String data) {
        System.out.printf(ERR_CODE + (RESPONSE_TEMPLATE) + "%n", data.getBytes(StandardCharsets.UTF_8).length, data);
    }

}