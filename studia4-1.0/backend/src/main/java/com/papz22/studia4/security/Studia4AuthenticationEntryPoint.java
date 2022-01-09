// package com.papz22.studia4.security;
// import java.io.IOException;

// import javax.servlet.http.HttpServletRequest;
// import javax.servlet.http.HttpServletResponse;

// import org.springframework.security.core.AuthenticationException;
// import org.springframework.security.web.authentication.www.BasicAuthenticationEntryPoint;
// import org.springframework.stereotype.Component;

// /*
// *   Just returns 401 Error
// */


// // @Component
// public class Studia4AuthenticationEntryPoint extends BasicAuthenticationEntryPoint
// {
//     @Override
//     public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authEx) 
//     throws IOException
//     {
//         response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
//     }
// }