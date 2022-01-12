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
        JDCBConnection connection = new JDCBConnection();
        String username = authentication.getName();
        ArrayList<String> params = new ArrayList<>();
        params.add(username);
        ResultSet result;
        String pesel = "";
        try{
            result = connection.getQueryResult(QueriesMapper.GET_PESEL, params);
            pesel = result.getString("person");
            result.close();
        }catch(SQLException e){
            e.printStackTrace();
        }
        return pesel;
    }
}