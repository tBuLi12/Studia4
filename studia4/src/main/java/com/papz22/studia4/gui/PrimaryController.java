package com.papz22.studia4.gui;

import java.io.IOException;
import javafx.fxml.FXML;

public class PrimaryController {

    @FXML
    private void switchToSecondary() throws IOException {
        Studia4Gui.setRoot("secondary");
    }
}
