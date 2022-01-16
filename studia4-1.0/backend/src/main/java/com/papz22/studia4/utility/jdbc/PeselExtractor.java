package com.papz22.studia4.utility.jdbc;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class PeselExtractor
{
    PeselExtractor(){};

    public String extract(Authentication authentication)
    {
        String username = authentication.getName();
        ArrayList<String> params = new ArrayList<>();
        params.add(username);
        ResultSet result;
        String pesel = "";
        try{
            JDCBConnection connection = new JDCBConnection();
            result = connection.getQueryResult(QueriesMapper.GET_PESEL, params);
            result.next();
            pesel = result.getString("person");
            result.close();
            connection.closeConnection();
        }catch(SQLException e){
            e.printStackTrace();
        }
        return pesel;
    }
}