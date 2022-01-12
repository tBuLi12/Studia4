package com.papz22.studia4.webconf;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.sql.Connection;
import java.sql.SQLException;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {
    private static HikariConfig config = new HikariConfig();
    private static HikariDataSource ds;
    private static String url = "jdbc:oracle:thin:@//ora4.ii.pw.edu.pl:1521/pdb1.ii.pw.edu.pl";

    static {
        config.setJdbcUrl( url );
        config.setUsername( "z22" );
        config.setPassword( "scma6z" );
        config.addDataSourceProperty( "cachePrepStmts" , "true" );
        config.addDataSourceProperty( "prepStmtCacheSize" , "250" );
        config.addDataSourceProperty( "prepStmtCacheSqlLimit" , "2048" );
        // config.setAutoCommit(false);
        ds = new HikariDataSource( config );
    }

    public DataSourceConfig() {}
    @Bean
    public static Connection getConnection() throws SQLException {
        return ds.getConnection();
    }
    @Bean
    public DataSource dataSource() throws SQLException {
        return ds;
    }
}
