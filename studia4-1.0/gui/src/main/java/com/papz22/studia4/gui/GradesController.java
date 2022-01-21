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
import javafx.scene.control.ToolBar;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.FlowPane;
import javafx.scene.layout.Pane;
import javafx.stage.Stage;

public class GradesController {

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
	@FXML
	ToolBar StudiaToolBar;
	@FXML
	FlowPane StudiaFlowPane;
	@FXML
	AnchorPane Back;
	
	private Stage stage;
	private Scene scene;
	private Parent root;
	
	Label BD1 = new Label("BD1");
	Label PAP = new Label("PAP");
	Label PROB = new Label("PROB");
	Label four = new Label("4");
	Label four_point_five = new Label("4.5");
	Label five = new Label("5");
	
	@FXML
	Pane Pane10, Pane11, Pane20, Pane21, Pane30, Pane31;
	
	String Theme;
	double Width, Height;
	
	public void grades_on_start(ActionEvent event) throws IOException {
		Pane10.getChildren().add(BD1);
		Pane20.getChildren().add(PAP);
		Pane30.getChildren().add(PROB);
		Pane11.getChildren().add(four);
		Pane21.getChildren().add(four_point_five);
		Pane31.getChildren().add(five);
	}
	
	public void set_Theme(String theme) {
		Theme = theme;
	}
	public void set_Size(double width, double height) {
		Back.setPrefWidth(width);
		Back.setPrefHeight(height);
	}
	
	public void schedule(ActionEvent event) throws IOException {
		FXMLLoader loader = new FXMLLoader(getClass().getResource("TimeTable.fxml"));	
		root = loader.load();
		
		Width = Back.getWidth();
		Height = Back.getHeight();
		
		ScheduleController scheduleController = loader.getController();
//		scheduleController.on_start(event);
		scheduleController.set_Theme(Theme);
		scheduleController.set_Size(Width, Height);
	
		stage = (Stage)((Node)event.getSource()).getScene().getWindow();
		scene = new Scene(root);
		stage.setScene(scene);
		
		String css = this.getClass().getResource(Theme).toExternalForm();
		scene.getStylesheets().add(css); // lepszy zapis jak mamy wiele scene
		
		stage.show();
	}
	
	public void grades(ActionEvent event) throws IOException {
		FXMLLoader loader = new FXMLLoader(getClass().getResource("Grades.fxml"));	
		root = loader.load();
		
		Width = Back.getWidth();
		Height = Back.getHeight();
		
		GradesController gradesController = loader.getController();
		gradesController.grades_on_start(event);
		gradesController.set_Theme(Theme);
		gradesController.set_Size(Width, Height);
		
		stage = (Stage)((Node)event.getSource()).getScene().getWindow();
		scene = new Scene(root);
		stage.setScene(scene);
		
		String css = this.getClass().getResource(Theme).toExternalForm();
		scene.getStylesheets().add(css); // lepszy zapis jak mamy wiele scene
		
		stage.show();
	}
	
	public void news(ActionEvent event) throws IOException {
		
		FXMLLoader loader = new FXMLLoader(getClass().getResource("News.fxml"));	
		root = loader.load();
		
		Width = Back.getWidth();
		Height = Back.getHeight();
		
		StudiaController studiaController = loader.getController();
		studiaController.set_Theme(Theme);
		studiaController.set_Size(Width, Height);
		
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
		
		Width = Back.getWidth();
		Height = Back.getHeight();
		
		SubjectsController subjectsController = loader.getController();
		subjectsController.set_Theme(Theme);
		subjectsController.set_Size(Width, Height);
		
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
		
		Width = Back.getWidth();
		Height = Back.getHeight();
		
		StudiaController studiaController = loader.getController();
		studiaController.set_Theme(Theme);
		studiaController.set_Size(Width, Height);
		
		stage = (Stage)((Node)event.getSource()).getScene().getWindow();
		scene = new Scene(root);
		stage.setScene(scene);
		
		String css = this.getClass().getResource(Theme).toExternalForm();
		scene.getStylesheets().add(css); // lepszy zapis jak mamy wiele scene
		
		stage.show();
	}
	
}
