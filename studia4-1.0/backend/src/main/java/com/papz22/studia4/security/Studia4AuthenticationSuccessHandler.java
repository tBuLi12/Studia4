package com.papz22.studia4.security;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

public class Studia4AuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    protected final Log logger = LogFactory.getLog(this.getClass());

    // private RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();

    public Studia4AuthenticationSuccessHandler() {
        super();
    }

    // API

    @Override
    public void onAuthenticationSuccess(final HttpServletRequest request, final HttpServletResponse response, final Authentication authentication) throws IOException {
        // System.out.println("auth");
        handle(request, response, authentication);
        clearAuthenticationAttributes(request);
    }

    // IMPL

    protected void handle(final HttpServletRequest request, final HttpServletResponse response, final Authentication authentication) throws IOException {
        final String targetUrl = determineTargetUrl(authentication);
        if (response.isCommitted()) {
            logger.debug("Response has already been committed. Unable to redirect to " + targetUrl);
            return;
        }
        // System.out.println(response.toString());
        // redirectStrategy.sendRedirect(request, response, "/");
        response.setStatus(HttpServletResponse.SC_MOVED_TEMPORARILY);
    }

    protected String determineTargetUrl(final Authentication authentication) {

        // Map<String, String> roleTargetUrlMap = new HashMap<>();
        // roleTargetUrlMap.put("ROLE_USER", "/homepage.html");
        // roleTargetUrlMap.put("ROLE_ADMIN", "/console.html");
        return authentication.getName();
        // final Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        // for (final GrantedAuthority grantedAuthority : authorities) {

        //     String authorityName = grantedAuthority.getAuthority();
        //     if(roleTargetUrlMap.containsKey(authorityName)) {
        //         return roleTargetUrlMap.get(authorityName);
        //     }
        // }

        // throw new IllegalStateException();
    }

    /**
     * Removes temporary authentication-related data which may have been stored in the session
     * during the authentication process.
     */
    protected final void clearAuthenticationAttributes(final HttpServletRequest request) {
        final HttpSession session = request.getSession(false);

        if (session == null) {
            return;
        }

        session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
    }

}