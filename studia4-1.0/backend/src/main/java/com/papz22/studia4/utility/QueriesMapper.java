package com.papz22.studia4.utility;

import org.springframework.stereotype.Component;

@Component
public enum QueriesMapper {

        CLASSES("SELECT Sbj.subject_id, Sbj.name "
        + "FROM Student S, Subject Sbj, Stud_subjects Stud_sbj "
        + "WHERE S.pesel=Stud_sbj.student AND Stud_sbj.subject=Sbj.subject_id AND S.pesel LIKE '?'"),

        SUBJECT("SELECT cl.id_classes, Cl.subject, Sbj.name, R.room_nr, Cl.class_type, Ts.week_day, Ts.time_slot "
        + "FROM Student S, Classes Cl, Subject Sbj, Classroom R, Time_slots Ts "
        + "WHERE S.student_group = Cl.student_group "
        + "AND Sbj.subject_id = Cl.subject " 
        + "AND Cl.class_room = R.room_id "
        + "AND Ts.time_slot_id = Cl.time_slot_id "
        + "AND S.pesel LIKE ?"),

        CHANGE_REQUEST("SELECT Cl.id_classes"
        + "FROM Classes Cl, (SELECT subject, class_type FROM Classes WHERE id_classes = '?') current_class "
        + "WHERE Cl.subject = current_class.subject AND Cl.class_type = current_class.class_type"),

        CURRENT_CLASS("SELECT req.old_classes_id, req.new_classes_id "
        + "FROM request_change_group req "
        + "WHERE req.student LIKE '?'");

        public final String QUERY;
        private QueriesMapper(String query){
            this.QUERY = query;
        }
        public String getQuery(){
            return this.QUERY;
        }

        public String getQuery(String param)
        {
            return this.QUERY.replace("?", param);
        }
}
