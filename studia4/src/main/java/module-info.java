module com.papz22.studia4 {
    requires javafx.controls;
    requires javafx.fxml;

    opens com.papz22.studia4.gui to javafx.fxml, javafx.graphics;
    exports com.papz22.studia4;
}
