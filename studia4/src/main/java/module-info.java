module gui {
    requires javafx.controls;
    requires javafx.fxml;
    exports com.papz22.studia4.gui;
}
module web {
    requires com.zaxxer.hikari;
    exports com.papz22.studia4.web;
}
