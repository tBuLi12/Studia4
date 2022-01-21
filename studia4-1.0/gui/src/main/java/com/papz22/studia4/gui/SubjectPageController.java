package com.papz22.studia4.gui;

import java.io.IOException;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.layout.AnchorPane;
import javafx.stage.Stage;

public class SubjectPageController {
	
	@FXML
	Label SubjectLabel;
	@FXML
	Label NameLabel, LabLabel, GroupLabel;
	@FXML
	Label TextNameLabel, TextLabLabel, TextGroupLabel;
	@FXML
	AnchorPane Back;
	
	private Stage stage;
	private Scene scene;
	private Parent root;
	
	String Theme;
	double Width, Height;
	
	public void set_Theme(String theme) {
		Theme = theme;
	}
	public void set_Size(double width, double height) {
		Back.setPrefWidth(width);
		Back.setPrefHeight(height);
	}
	
	public void load_data(String subject, String name, String lab, String group) {
		SubjectLabel.setText(subject);
		TextNameLabel.setText(name);
		TextLabLabel.setText(lab);
		TextGroupLabel.setText(group);
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
