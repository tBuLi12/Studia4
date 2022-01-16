package com.papz22.studia4.utility;

import com.papz22.studia4.utility.exception.InvalidRequestParameterException;

import org.springframework.stereotype.Component;

@Component
public class ParametersValidator {
    ParametersValidator(){}

    public static void isInteger(String str) throws InvalidRequestParameterException{
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
        if(!result) throw new InvalidRequestParameterException("Parameter must be a number!");
    }
    
}
