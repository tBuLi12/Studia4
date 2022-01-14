package com.papz22.studia4.gui;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.StringJoiner;

import javafx.beans.property.SimpleStringProperty;
import javafx.beans.property.StringProperty;
import javafx.beans.value.ObservableValue;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.PasswordField;
import javafx.scene.control.RadioButton;
import javafx.scene.control.TextField;
import javafx.scene.control.ToggleGroup;
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
		
		if(username.equals("a") && password.equals("a")) {
			
			// URL url = new URL("papz22.tplinkdns.com:2137/login");
			// URLConnection con = url.openConnection();
			// HttpURLConnection http = (HttpURLConnection)con;
			// http.setRequestMethod("POST"); // PUT is another valid option
			// http.setDoOutput(true);
			
			// Map<String,String> arguments = new HashMap<>();
			// arguments.put("username", "student");
			// arguments.put("password", "admin");
			// StringJoiner sj = new StringJoiner("&");
			// for(Map.Entry<String,String> entry : arguments.entrySet())
			//     sj.add(URLEncoder.encode(entry.getKey(), "UTF-8") + "=" 
			//          + URLEncoder.encode(entry.getValue(), "UTF-8"));
			// byte[] out = sj.toString().getBytes(StandardCharsets.UTF_8);
			// int length = out.length;
			
			// http.setFixedLengthStreamingMode(length);
			// http.setRequestProperty("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
			// http.connect();
			// try(OutputStream os = http.getOutputStream()) {
			//     os.write(out);
			// }
			
			
			
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
