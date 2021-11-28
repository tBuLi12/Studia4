package com.papz22.studia4;


import org.springframework.boot.autoconfigure.SpringBootApplication;


import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import com.papz22.studia4.web.*;

/**
 * Hello world!
 *
 */
@SpringBootApplication
public class App 
{
	public static List<Worker> fetchData() {
        final String SQL_QUERY = "select * from worker";
        List<Worker> employees = null;
        try (Connection con = DataSource.getConnection(); PreparedStatement pst = con.prepareStatement(SQL_QUERY); ResultSet rs = pst.executeQuery();) {
            employees = new ArrayList<Worker>();
            Worker employee;
            while (rs.next()) {
                employee = new Worker();
                employee.setPesel(rs.getString("pesel"));
                System.out.println(employee.getPesel());

            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return employees;
    }
    public static void main( String[] args )
    {
        fetchData();
        System.out.println( "Hello World!" );
       
    }
}
