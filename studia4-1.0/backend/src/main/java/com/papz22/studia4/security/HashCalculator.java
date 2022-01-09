package com.papz22.studia4.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

// @Configuration("Security")
@Component
@ConfigurationProperties(prefix = "security.data")
public class HashCalculator {
    // @Value("${security.data.algorithm}")
    private String algorithm = "SHA3-512";
    // @Autowired
    private MessageDigest digest;
    private static final byte[] HEX_ARRAY = "0123456789ABCDEF".getBytes(StandardCharsets.US_ASCII);

    public HashCalculator() throws NoSuchAlgorithmException
    {
        digest = MessageDigest.getInstance(algorithm);
    }

    // public HashCalculator(String algorithm) throws NoSuchAlgorithmException
    // {
    //     digest = MessageDigest.getInstance(algorithm);
    // };

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
    // @Bean
    public String encode(String text)
    {
        byte[] hashbytes = digest.digest(text.getBytes(StandardCharsets.UTF_8));
        return bytesToHex(hashbytes);
    }
}
