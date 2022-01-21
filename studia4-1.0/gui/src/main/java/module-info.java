module com.papz22.studia4.gui {
    requires javafx.controls;
    requires javafx.fxml;
    requires transitive javafx.graphics;
    requires javafx.base;
    requires java.net.http;
    requires org.testfx;
    requires org.junit.jupiter.api;
    requires org.assertj.core;
    requires org.testfx.junit5;
    
    opens com.papz22.studia4.gui to javafx.fxml;
    exports com.papz22.studia4.gui;
}
