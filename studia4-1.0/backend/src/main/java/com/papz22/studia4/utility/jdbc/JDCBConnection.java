package com.papz22.studia4.utility.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import com.papz22.studia4.utility.exception.NotMatchingParameterException;
import com.papz22.studia4.webconf.DataSourceConfig;

import org.springframework.stereotype.Component;

@Component
public class JDCBConnection {

    private Connection connection;
    public JDCBConnection() throws SQLException
    {
        connection = DataSourceConfig.getConnection();
    };

    private String queryToString(QueriesMapper query)
    {
        return query.getQuery();
    }

    private String mapParametersToQuery(String query, ArrayList<String> params) throws NotMatchingParameterException
    {
        long questionmarkCount = query.chars().filter(ch -> ch == '?').count();
        int paramsCount = params.size();
        if (paramsCount != (int) questionmarkCount) throw new NotMatchingParameterException();
        for (String param : params)
        {
            query = query.replaceFirst("[?]", param);
        }
        System.out.println("==============================");
        System.out.println(query);
        System.out.println("==============================");
        return query;
    }

    public ResultSet getQueryResut(QueriesMapper query) throws SQLException
    {
        
        PreparedStatement pst = connection.prepareStatement(queryToString(query));
        ResultSet rs = pst.executeQuery();
        return rs;
    }

    public ResultSet getQueryResult(QueriesMapper query, ArrayList<String> params) throws SQLException
    {
        PreparedStatement pst = connection.prepareStatement(mapParametersToQuery(queryToString(query), params));
        ResultSet rs = pst.executeQuery();
        return rs;
    }

    public void executeUpdateOrDelete(QueriesMapper query, ArrayList<String> params) throws SQLException
    {
        PreparedStatement pst = connection.prepareStatement(mapParametersToQuery(queryToString(query), params));
        pst.executeUpdate();
        pst.close();
    }

    public void closeConnection() throws SQLException
    {
        this.connection.close();
    }
}
