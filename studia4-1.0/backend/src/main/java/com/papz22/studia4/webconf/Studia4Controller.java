package com.papz22.studia4.webconf;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.papz22.studia4.repository.*;
import java.util.ArrayList;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@RestController
public class Studia4Controller {
    enum Queries {
        CLASSES("SELECT Sbj.name FROM Student S, Subject Sbj, Stud_subjects Stud_sbj WHERE S.pesel=Stud_sbj.student AND Stud_sbj.subject=Sbj.subject_id AND S.pesel LIKE '01241012343'"),
        COURSES("SELECT Cl.subject, Sbj.name, R.room_nr, Cl.week_day, Cl.class_start_time FROM Student S, Classes Cl, Subject Sbj, Classroom R WHERE S.student_group = Cl.student_group AND Sbj.subject_id = Cl.subject AND Cl.class_room = R.room_id AND S.pesel LIKE '01241012343'");
        public final String QUERY;
        private Queries(String query){
            this.QUERY = query;
        }
        public String get_query(){
            return this.QUERY;
        }
    }
    @GetMapping("/courses")
    ArrayList<UniSubject> get_courses(@RequestParam(required = false) String pesel) {
        ArrayList<UniSubject> clss = new ArrayList<>();
        try (Connection con = DataSourceConfig.getConnection();
        PreparedStatement pst = con.prepareStatement(Queries.CLASSES.get_query());
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
    ArrayList<Classes> get_classes(@RequestParam(required = false) String pesel) {
        ArrayList<Classes> lectures = new ArrayList<>();
        try (Connection con = DataSourceConfig.getConnection();
        PreparedStatement pst = con.prepareStatement(Queries.COURSES.get_query());
        ResultSet rs = pst.executeQuery();) {
            Classes lecture;
            while (rs.next()) {
                lecture = new Classes();
                lecture.setSubject_id(rs.getInt("subject"));
                lecture.setName(rs.getString("name"));
                lecture.setWeek_day(rs.getString("week_day"));
                lecture.setStarting_time(rs.getString("class_start_time"));
                lectures.add(lecture);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return lectures;
    }
}
