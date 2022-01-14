package com.papz22.studia4.gui;
	
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.stage.Stage;
import javafx.scene.Parent;
import javafx.scene.Scene;
import java.io.IOException;

public class Main extends Application {
	
	private static Scene scene;
	
	@Override
	public void start(Stage stage) throws IOException {
		try {
			Parent root;
			FXMLLoader loader = new FXMLLoader(getClass().getResource("Login.fxml"));
			root = loader.load();
			scene = new Scene(root);
			
			String First_theme = "Light.css";
			
			String css = this.getClass().getResource(First_theme).toExternalForm();
			scene.getStylesheets().add(css);
			
			LoginController loginController = loader.getController();
			loginController.on_start(scene);
			loginController.LabelTheme.setText(First_theme);
			
			stage.setScene(scene);
			stage.show();
			
		} catch(Exception e) {
			e.printStackTrace();
		}
	}
	
	
	public static void main(String[] args) {
		launch(args);
	}
}
