package com.papz22.studia4.gui;

import java.io.IOException;
import javafx.fxml.FXML;

public class SecondaryController {

    @FXML
    private void switchToPrimary() throws IOException {
        Studia4Gui.setRoot("primary");
    }
}