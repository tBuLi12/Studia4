package com.papz22.studia4.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "security.data")
public class HashCalculator implements PasswordEncoder{

    private String algorithm = "SHA3-512";
    private MessageDigest digest;
    private static final byte[] HEX_ARRAY = "0123456789ABCDEF".getBytes(StandardCharsets.US_ASCII);

    public HashCalculator() throws NoSuchAlgorithmException
    {
        digest = MessageDigest.getInstance(algorithm);
    }

    public void setAlgorithm(String algorithm) throws NoSuchAlgorithmException
    {
        this.algorithm = algorithm;
        digest = MessageDigest.getInstance(algorithm);
    }

    public String getAlgorithm()
    {
        return algorithm;
    }

    private String bytesToHex(byte[] bytes) 
    {
        byte[] hexChars = new byte[bytes.length * 2];
        for (int j = 0; j < bytes.length; j++)
        {
            int v = bytes[j] & 0xFF; // just need last two bytes from integer, java by default extends sign
            hexChars[j * 2] = HEX_ARRAY[v >>> 4]; // cause there are no unsingned ints we create one, than match it to hex
            hexChars[j * 2 + 1] = HEX_ARRAY[v & 0x0F]; // the rest of number
        }
    return new String(hexChars, StandardCharsets.UTF_8);
    }
    @Override
    public String encode(CharSequence text)
    {
        byte[] hashbytes = digest.digest(text.toString().getBytes(StandardCharsets.UTF_8));
        String result = bytesToHex(hashbytes); 
        return result;
    }
    @Override
    public boolean matches(CharSequence plainTextPassword, String passwordInDatabase)
    {
        return encode(plainTextPassword).matches(passwordInDatabase);
    }
}
