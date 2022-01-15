package com.papz22.studia4.gui;

import java.io.IOException;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.Pane;
import javafx.stage.Stage;

public class ScheduleController {

	@FXML
	Button ScheduleButton;
	@FXML
	Button NewsButton;
	@FXML
	Button SubjectsButton;
	@FXML
	Button GradesButton;
	@FXML
	Button RegisterButton;
	
	private Stage stage;
	private Scene scene;
	private Parent root;
	
    Label text = new Label("WSI"); 
	@FXML
    Pane Pane42;
	public void on_start(ActionEvent event) throws IOException {
	    Pane42.getChildren().add(text);
	    text.textFillProperty();
	    
	}
	
	String Theme;
	
	public void set_Theme(String theme) {
		Theme = theme;
	}
	
	public void news(ActionEvent event) throws IOException {
		FXMLLoader loader = new FXMLLoader(getClass().getResource("News.fxml"));	
		root = loader.load();
		
		StudiaController studiaController = loader.getController();
		studiaController.set_Theme(Theme);
		
		stage = (Stage)((Node)event.getSource()).getScene().getWindow();
		scene = new Scene(root);
		stage.setScene(scene);
		
		String css = this.getClass().getResource(Theme).toExternalForm();
		scene.getStylesheets().add(css); // lepszy zapis jak mamy wiele scene
		
		stage.show();
	}
	
	public void subjects(ActionEvent event) throws IOException {
		FXMLLoader loader = new FXMLLoader(getClass().getResource("Subjects.fxml"));	
		root = loader.load();
		
		SubjectsController subjectsController = loader.getController();
		subjectsController.set_Theme(Theme);

		stage = (Stage)((Node)event.getSource()).getScene().getWindow();
		scene = new Scene(root);
		stage.setScene(scene);

		String css = this.getClass().getResource(Theme).toExternalForm();
		scene.getStylesheets().add(css);
		
		stage.show();
	}
	
	public void grades(ActionEvent event) throws IOException {
		FXMLLoader loader = new FXMLLoader(getClass().getResource("Grades.fxml"));	
		root = loader.load();
		
		GradesController gradesController = loader.getController();
		gradesController.grades_on_start(event);
		gradesController.set_Theme(Theme);
		
		stage = (Stage)((Node)event.getSource()).getScene().getWindow();
		scene = new Scene(root);
		stage.setScene(scene);

		String css = this.getClass().getResource(Theme).toExternalForm();
		scene.getStylesheets().add(css); // lepszy zapis jak mamy wiele scene
		
		stage.show();
	}
	
	public void register(ActionEvent event) throws IOException {
		FXMLLoader loader = new FXMLLoader(getClass().getResource("Registration.fxml"));	
		root = loader.load();
		
		StudiaController studiaController = loader.getController();
		studiaController.set_Theme(Theme);
		
		stage = (Stage)((Node)event.getSource()).getScene().getWindow();
		scene = new Scene(root);
		stage.setScene(scene);

		String css = this.getClass().getResource(Theme).toExternalForm();
		scene.getStylesheets().add(css); // lepszy zapis jak mamy wiele scene
		
		stage.show();
	}

	public void show_subject(ActionEvent event) throws IOException {
		Button butt = (Button)event.getSource();
		System.out.println(butt.getText());
		// go_to_subject(butt.getText(), event);
		
	}
	// public void go_to_subject(String subject_name, ActionEvent event){

	// 	FXMLLoader loader = new FXMLLoader(getClass().getResource("subjectPage.fxml"));	
	// 	root = loader.load();
		
	// 	SubjectPageController pageController = loader.getController();
	// 	pageController.set_Theme(Theme);

	// 	stage = (Stage)((Node)event.getSource()).getScene().getWindow();
	// 	scene = new Scene(root);
	// 	stage.setScene(scene);

	// 	String css = this.getClass().getResource(Theme).toExternalForm();
	// 	scene.getStylesheets().add(css);
		
	// 	stage.show();

	// }
	
}
