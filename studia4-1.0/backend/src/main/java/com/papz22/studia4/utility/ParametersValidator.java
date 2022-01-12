package com.papz22.studia4.utility;

import com.papz22.studia4.utility.exception.InvalidGetParameterException;

import org.springframework.stereotype.Component;

@Component
public class ParametersValidator {
    ParametersValidator(){}

    public static void isInteger(String str) throws InvalidGetParameterException{
        boolean result = true;
        if (str == null) {
            result = false;
        }
        int length = str.length();
        if (length == 0) {
            result = false;
        }
        int i = 0;
        if (str.charAt(0) == '-') {
            if (length == 1) {
                result = false;
            }
            i = 1;
        }
        for (; i < length; i++) {
            char c = str.charAt(i);
            if (c < '0' || c > '9') {
                result = false;
            }
        }
        if(!result) throw new InvalidGetParameterException("Parameter must be a number!");
    }
    
}
