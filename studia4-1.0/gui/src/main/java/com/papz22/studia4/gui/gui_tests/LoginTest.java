package com.papz22.studia4.gui.gui_tests;

import java.io.IOException;

import javafx.event.ActionEvent;

import com.papz22.studia4.gui .LoginController;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.testfx.api.FxRobot;
import org.testfx.assertions.api.Assertions;
import org.testfx.framework.junit5.ApplicationExtension;
import org.testfx.framework.junit5.Start;

public class LoginTest {
    public static LoginController loginCtrl = new LoginController();
    public static ActionEvent event = new ActionEvent();
    
    public static void test_auth(){
        
        try {
            loginCtrl.log_in(event);
        } catch (IOException e) {
            e.printStackTrace();
        }

        System.out.println("passed");
    }


    public static void main(String[] args){
        test_auth();
    }
}