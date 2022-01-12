module com.papz22.studia4.gui {
    requires javafx.controls;
    requires javafx.fxml;
    requires transitive javafx.graphics;

    opens com.papz22.studia4.gui to javafx.fxml;
    exports com.papz22.studia4.gui;
}
