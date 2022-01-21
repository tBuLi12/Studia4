package com.papz22.studia4.gui;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.Reader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.StringJoiner;



import java.net.Authenticator;
import java.net.PasswordAuthentication;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;

import javafx.beans.property.SimpleStringProperty;
import javafx.beans.property.StringProperty;
import javafx.beans.value.ObservableValue;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.PasswordField;
import javafx.scene.control.RadioButton;
import javafx.scene.control.TextField;
import javafx.scene.control.ToggleGroup;
import javafx.scene.control.Alert.AlertType;
import javafx.scene.layout.AnchorPane;
import javafx.stage.Stage;

public class LoginController{
	@FXML
	private TextField LoginTextField;
	@FXML
	private PasswordField PasswordTextField;
	@FXML	
	private Button LogButton;
	@FXML
	private ToggleGroup ModeGroup;
	@FXML
	private RadioButton DarkRadioButton, LightRadioButton;
	@FXML
	Label LabelTheme;
	@FXML AnchorPane BackAnchorPane;
		
	private Stage stage;
	public Scene scene;
	private Parent root;
	
	
	private String Theme = new String("Dark.css");
	
	public String get_theme() {
		return this.LabelTheme.getText();
	}
	
	public void on_start(Scene scene){
		this.scene = scene;
	}
	
	public void log_in(ActionEvent event) throws IOException {
		
		String username = LoginTextField.getText();
		String password = PasswordTextField.getText();
		
		URL url = new URL("http://localhost:3000/login");
		HttpURLConnection http = (HttpURLConnection)url.openConnection();
		http.setRequestMethod("POST");
		http.setDoOutput(true);
		http.setRequestProperty("Authorization", "Basic YXZha2phbkBtYWlsLnJ1OnNhc2Fz");
		http.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
		
		String data = String.format("username=%s&password=%s", username, password);
		
		byte[] out = data.getBytes(StandardCharsets.UTF_8);
		
		OutputStream stream = http.getOutputStream();
		stream.write(out);
		
		int code = http.getResponseCode();
		System.out.println(code + " " + http.getResponseMessage());
		http.disconnect();

		if (code == 302){
			scene = BackAnchorPane.getScene();
			FXMLLoader loader = new FXMLLoader(getClass().getResource("Studia.fxml"));	
			root = loader.load();
			
			StudiaController studiaController = loader.getController();
			studiaController.set_Theme(LabelTheme.getText());
						
			stage = (Stage)((Node)event.getSource()).getScene().getWindow();
			scene = new Scene(root);
			stage.setScene(scene);
			stage.sizeToScene();

			
			String css = this.getClass().getResource(LabelTheme.getText()).toExternalForm();
			scene.getStylesheets().add(css); // lepszy zapis jak mamy wiele scene
			
			stage.show();
		}
		else{
			Alert alert = new Alert(AlertType.ERROR);
			alert.setContentText("Błędny login lub hasło!");
			alert.show();
		}
	}
	
	public void setTheme(String t) {
        this.Theme = t; 
    }
	
	public void setmode(ActionEvent event) throws IOException{
		
		String css;
		
		if(DarkRadioButton.isSelected()) {
			LabelTheme.setText("Dark.css");
//			System.out.println(this.scene);
			this.scene.getStylesheets().clear();
			css = this.getClass().getResource("Dark.css").toExternalForm();
			this.scene.getStylesheets().add(css);
		}
		if(LightRadioButton.isSelected()) {
			LabelTheme.setText("Light.css");			
//			System.out.println(this.scene);
			this.scene.getStylesheets().clear();
			css = this.getClass().getResource("Light.css").toExternalForm();
			this.scene.getStylesheets().add(css);		
		}
	}
}
