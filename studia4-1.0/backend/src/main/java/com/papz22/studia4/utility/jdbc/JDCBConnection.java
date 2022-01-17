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
        //TODO add some descent logger to app
        System.out.println("==============================");
        System.out.println(query);
        System.out.println("==============================");
        return query;
    }

    private String mapInParametersToQuery(String query, ArrayList<String> params)
    {
        StringBuilder inParams = new StringBuilder();
        for (String param : params)
        {
            inParams.append(param + ", ");
        }
        String resultIn = inParams.toString().trim();
        resultIn = resultIn.substring(0, resultIn.length() - 1);
        query = query.replace("*?*", resultIn);
        System.out.println("==============================");
        System.out.println(query);
        System.out.println("==============================");
        return query;
    }

    private String mapParametersToQuery(String query, String param) throws NotMatchingParameterException
    {
        query = query.replaceAll("[?]", param);
        //TODO add some descent logger to app
        System.out.println("==============================");
        System.out.println(query);
        System.out.println("==============================");
        return query;
    }

    private String mapParametersToQueryStringAndList(String query, String stringParam, ArrayList<String> params) throws NotMatchingParameterException
    {
        StringBuilder inParams = new StringBuilder();
        for (String param : params)
        {
            inParams.append(param + ", ");
        }
        String resultIn = inParams.toString().trim();
        resultIn = resultIn.substring(0, resultIn.length() - 1);
        query = query.replace("*?*", resultIn);
        query = query.replaceFirst("[?]", stringParam);
        //TODO add some descent logger to app
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

    public ResultSet getListQueryResultSet(QueriesMapper query, ArrayList<String> params) throws SQLException
    {
        PreparedStatement pst = connection.prepareStatement(mapInParametersToQuery(queryToString(query), params));
        ResultSet rs = pst.executeQuery();
        return rs;
    }

    public ResultSet getListQueryResultSetWithString(QueriesMapper query, String param ,ArrayList<String> params) throws SQLException
    {
        PreparedStatement pst = connection.prepareStatement(mapParametersToQueryStringAndList(queryToString(query), param, params));
        ResultSet rs = pst.executeQuery();
        return rs;
    }

    public ResultSet getQueryResultSet(QueriesMapper query, String param) throws SQLException
    {
        PreparedStatement pst = connection.prepareStatement(mapParametersToQuery(queryToString(query), param));
        ResultSet rs = pst.executeQuery();
        return rs;
    }

    public void executeUpdateOrDelete(QueriesMapper query, ArrayList<String> params) throws SQLException
    {
        PreparedStatement pst = connection.prepareStatement(mapParametersToQuery(queryToString(query), params));
        pst.executeUpdate();
        pst.close();
    }

    public void executeUpdateOrDelete(QueriesMapper query, String param) throws SQLException
    {
        PreparedStatement pst = connection.prepareStatement(mapParametersToQuery(queryToString(query), param));
        pst.executeUpdate();
        pst.close();
    }

    public void executeUpdateOrDeleteListWithString(QueriesMapper query, String param ,ArrayList<String> params) throws SQLException
    {
        PreparedStatement pst = connection.prepareStatement(mapParametersToQueryStringAndList(queryToString(query), param, params));
        pst.executeUpdate();
        pst.close();
    }

    public void closeConnection() throws SQLException
    {
        this.connection.close();
    }

    public void executeUpdateOrDelete(QueriesMapper buildScheduleGetClassids) {
    }
}
