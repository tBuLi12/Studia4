package com.papz22.studia4.utility.exception;

import java.sql.SQLException;

public class NotMatchingParameterException extends SQLException {
    public NotMatchingParameterException()
    {
        super("The number of given parameters is not matching number of query parameters!");
    }
}
