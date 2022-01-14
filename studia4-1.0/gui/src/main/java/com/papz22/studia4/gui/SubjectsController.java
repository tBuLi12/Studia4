package com.papz22.studia4.gui;

import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;

import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.ListView;
import javafx.scene.control.ToolBar;
import javafx.scene.layout.FlowPane;
import javafx.stage.Stage;

public class SubjectsController implements Initializable{

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
	Label SubjectLabel;
	@FXML
	ListView <String> SubjectListView;
	
	private Stage stage;
	private Scene scene;
	private Parent root;
	
	String[] subjects = {"Probabilistyka", "Bazy Danych 1", "Programowanie aplikacyjne"};
	
	String currentSubject;
	
	String Theme;
	
	public void set_Theme(String theme) {
		Theme = theme;
	}
	
	@Override
	public void initialize(URL arg0, ResourceBundle arg1) {
		
		SubjectListView.getItems().addAll(subjects);
		// TODO Auto-generated method stub
		SubjectListView.getSelectionModel().selectedItemProperty().addListener(new ChangeListener<String>()
				{

					@Override
					public void changed(ObservableValue<? extends String> arg0, String arg1, String arg2) {
						// TODO Auto-generated method stub
						
						currentSubject = SubjectListView.getSelectionModel().getSelectedItem();
						
						SubjectLabel.setText(currentSubject);
						
					}
			
				});
		
	}
	
	public void schedule(ActionEvent event) throws IOException {
		FXMLLoader loader = new FXMLLoader(getClass().getResource("TimeTable.fxml"));	
		root = loader.load();
		
		ScheduleController scheduleController = loader.getController();
		scheduleController.on_start(event);
		scheduleController.set_Theme(Theme);

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
		scene.getStylesheets().add(css); // lepszy zapis jak mamy wiele scene
		
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

}
