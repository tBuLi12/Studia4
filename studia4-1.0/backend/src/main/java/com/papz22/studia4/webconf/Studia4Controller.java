package com.papz22.studia4.webconf;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import com.papz22.studia4.repository.Classes;
import com.papz22.studia4.repository.UniSubject;
import com.papz22.studia4.utility.QueriesMapper;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Studia4Controller {

    @GetMapping("/courses")
    ArrayList<UniSubject> getCourses(@RequestParam String pesel) {
        ArrayList<UniSubject> clss = new ArrayList<>();
        try (Connection con = DataSourceConfig.getConnection();
        PreparedStatement pst = con.prepareStatement(QueriesMapper.SUBJECT.getQuery(pesel));
        ResultSet rs = pst.executeQuery();){
            UniSubject cls;
            while (rs.next()) {
                cls = new UniSubject();
                cls.setName(rs.getString("name"));
                clss.add(cls);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return clss;
    }
    @GetMapping("/classes")
    ArrayList<Classes> getClasses(@RequestParam(required = false) String pesel) {
        ArrayList<Classes> lectures = new ArrayList<>();
        try (Connection con = DataSourceConfig.getConnection();
        PreparedStatement pst = con.prepareStatement(QueriesMapper.CLASSES.getQuery());
        ResultSet rs = pst.executeQuery();) {
            Classes lecture;
            while (rs.next()) {
                lecture = new Classes();
                lecture.setSubject_id(rs.getInt("subject"));
                lecture.setName(rs.getString("name"));
                // lecture.setWeek_day(rs.getString("week_day"));
                // lecture.setStarting_time(rs.getString("class_start_time"));
                lectures.add(lecture);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return lectures;
    }  
}