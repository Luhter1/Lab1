package org.web;

import java.util.List;
import java.util.Locale;

public record Coordinates(float x, int y, float r) {
    private static final List<Integer> validY = List.of(-5, -4, -3, -2, -1, 0, 1, 2, 3);
    private static final List<Float> validR = List.of(1F, 1.5F, 2F, 2.5F, 3F);

    public static Coordinates parser(String toParse) throws NullPointerException, NumberFormatException{
        float X = -10, R = -10;
        int Y = -10;

        if(toParse.contains("x=") && toParse.contains("y=") && toParse.contains("r=")){
            String[] pars = toParse.split("&");
    
            for(String par: pars){
                String[] splitted_par = par.split("=");
                
                switch (splitted_par[0]) {
                    case "x" -> X = Float.parseFloat(splitted_par[1]);
                    case "y" -> Y = Integer.parseInt(splitted_par[1]);
                    case "r" -> R = Float.parseFloat(splitted_par[1]);
                }
            }

            // если не прошло, значит не были проинициализированны
            if (X>-10 && Y>-10 && R>-10) return new Coordinates(X, Y, R);
        }

        throw new NullPointerException();
    }

    public void validate() throws IllegalArgumentException{
        if(!(validY.contains(y) && validR.contains(r) && -3 <= x && x <= 3)){
            throw new IllegalArgumentException();
        }
    }

    public boolean checkArea(){
        if((x<-r) || (x>r) || (y<-r) || (y>r)){
            return false;
        }else if((x<0) && (y>0)){
            return false;
        }else if((x>0) && (y>0)) {
            return x<=r && y<=r;
        }else if((x>0) && (y<0)) {
            return (x-y)<=r;
        }else if((x<0) && (y<0)) {
            return x*x + y*y <= r*r;
        }

        return true;
    }

    public String getPars(){
        return String.format(Locale.US, "\"x\": %f, \"y\": %d, \"r\": %f", x, y, r);
    }
}