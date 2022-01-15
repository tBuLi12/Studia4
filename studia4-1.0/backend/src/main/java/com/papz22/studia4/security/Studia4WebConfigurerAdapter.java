package com.papz22.studia4.security;

import java.sql.SQLException;

import com.papz22.studia4.webconf.DataSourceConfig;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.provisioning.JdbcUserDetailsManager;

@Configuration
@EnableWebSecurity
public class Studia4WebConfigurerAdapter extends WebSecurityConfigurerAdapter
{
    @Autowired
    private UnauthenticatedRequestHandler authenticationEntryPoint;
    @Autowired
    private HashCalculator encoder;
    @Autowired
    private DataSourceConfig datasource;
    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {

        auth.userDetailsService(jdbcUserDetailsManager()).passwordEncoder(encoder); 
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
      //if we want csrf csrf token will be needed
        http.csrf().disable().authorizeRequests()
          .antMatchers("/index*", "/static/**", "/*.js", "/*.json", "/*.ico").permitAll()
          .anyRequest().authenticated()
          .and()
          .formLogin()
              .loginPage("/login") // here you will be redirected when trying to access
              // .loginProcessingUrl("/login/1") // POST to this URL if you want to authenticate
              .defaultSuccessUrl("/index.html")
              .successHandler(successHandler())
              .permitAll()
              .and()
          .logout()
          .deleteCookies("auth_code", "JSESSIONID")
              .permitAll()
              .and()
              .httpBasic()
              .authenticationEntryPoint(authenticationEntryPoint);


    }
    @Bean
    public JdbcUserDetailsManager jdbcUserDetailsManager() throws SQLException
    {
      JdbcUserDetailsManager jdbcUserDetailsManager = new JdbcUserDetailsManager();
      jdbcUserDetailsManager.setDataSource(datasource.dataSource());
      
      return jdbcUserDetailsManager;
    }

    @Bean
    public Studia4AuthenticationSuccessHandler successHandler()
    {
      return new Studia4AuthenticationSuccessHandler();
    }
  
}
