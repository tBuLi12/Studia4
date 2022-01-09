package com.papz22.studia4.security;

import com.papz22.studia4.webconf.DataSourceConfig;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.task.DelegatingSecurityContextAsyncTaskExecutor;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class Studia4WebConfigurerAdapter extends WebSecurityConfigurerAdapter
{
    // private Studia4WebConfigurerAdapter authenticationEntryPoint;
    @Autowired
    private HashCalculator encoder;
    @Autowired
    private DataSourceConfig datasource;
    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        // auth.inMemoryAuthentication()
        //   .withUser("user1").password(encoder.encode("user1Pass"))
        //   .authorities("ROLE_USER");
          auth.jdbcAuthentication()
      .dataSource(datasource.dataSource())
    //   .withDefaultSchema()
    .usersByUsernameQuery("select username,hash"
    + "from passwd"
    + "where username = ?")
      .authoritiesByUsernameQuery("select username,security_group "
        + "from passwd "
        + "where username = ?")
      .withUser("admin")
      .password(encoder.encode("admin"))
      .roles("ADMIN");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
          .antMatchers("/login").permitAll()
          .anyRequest().authenticated()
          .and()
          .httpBasic();
        //   .authenticationEntryPoint(authenticationEntryPoint);

    }
    // @Bean
    // public ThreadPoolTaskExecutor threadPoolTaskExecutor() {
    //     ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
    //     executor.setCorePoolSize(10);
    //     executor.setMaxPoolSize(100);
    //     executor.setQueueCapacity(50);
    //     executor.setThreadNamePrefix("async-");
    //     return executor;
    // }

    // @Bean
    // public DelegatingSecurityContextAsyncTaskExecutor taskExecutor(ThreadPoolTaskExecutor delegate) {
    //     return new DelegatingSecurityContextAsyncTaskExecutor(delegate);
    // }
}
