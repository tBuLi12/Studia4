package com.papz22.studia4.utility.jdbc;

public enum QueriesMapper {

        CLASSES("SELECT cl.id_classes, sub.name, cl.class_type, cr.room_nr, ts.week_day, ts.time_slot_id "
        + "FROM Users usr "
        + "inner join Student s on s.person = usr.person "
        + "inner join Stud_classes st_cl on st_cl.student = s.person "
        + "inner join Classes cl on cl.id_classes = st_cl.id_classes "
        + "inner join Subject sub on sub.subject_id = cl.subject "
        + "inner join Classroom cr on cr.room_id = cl.class_room "
        + "inner join time_slots ts on ts.time_slot_id = cl.time_slot_id "
        + "where usr.username like '?'"),

        COURSES("SELECT Sbj.subject_id as sbj_subject_id, Sbj.name as sbj_name "
        + "FROM Users usr, Student S, Subject Sbj, Stud_subjects Stud_sbj "
        + "WHERE usr.username like '?' "
        + "AND S.person = usr.person "
        + "AND S.person = Stud_sbj.student "
        + "AND Stud_sbj.subject = Sbj.subject_id"),

        CHANGE_REQUEST("SELECT Cl.id_classes"
        + "FROM Classes Cl, (SELECT subject, class_type FROM Classes WHERE id_classes = '?') current_class "
        + "WHERE Cl.subject = current_class.subject AND Cl.class_type = current_class.class_type"),

        CURRENT_CLASS("SELECT req.old_classes_id, req.new_classes_id "
        + "FROM request_change_group req "
        + "WHERE req.student LIKE '?'"),

        GET_PESEL("SELECT person FROM Users WHERE username = '?'"),

        DELETE_REQUEST_CHANGE_GROUP("DELETE FROM request_change_group req WHERE req.request_id = ?"),

        REQUESTS("SELECT req.request_id, sub.name, cl.class_type, req.student, ts.week_day, ts.time_slot_id "
        +"FROM request_change_group req "
        +"JOIN Classes cl on req.new_classes_id = cl.id_classes "
        +"JOIN Subject sub on cl.subject = sub.subject_id "
        +"JOIN Users usr on usr.person = sub.coordinator "
        +"JOIN Time_slots ts on ts.time_slot_id = cl.time_slot_id "
        +"WHERE usr.username = '?'"),

        ADD_RESCHEDULE("INSERT INTO request_change_group VALUES (NULL, '?', ?, ?);"),

        RESCHEDULE("UPDATE stud_classes "
        +"SET id_classes = (SELECT new_classes_id FROM request_change_group WHERE request_id = ?) "
        +"WHERE student = (SELECT student FROM request_change_group WHERE request_id = ?) "
        +"AND id_classes = (SELECT old_classes_id FROM request_change_group WHERE request_id = ?)"),

        GRADES("SELECT sub.name, stud_sub.grade "
        +"FROM Users usr "
        +"JOIN Stud_subjects stud_sub on usr.person = stud_sub.student "
        +"JOIN Subject sub on sub.subject_id = stud_sub.subject "
        +"WHERE usr.username = '?'"),

        RATINGS("SELECT tsr.time_slot_id, tsr.rating "
        +"FROM Users usr "
        +"JOIN Time_slots_ratings tsr on usr.person = tsr.student "
        +"WHERE usr.username = '?'"),

        SET_RATINGS("INSERT INTO Time_slots_ratings VALUES((Select person FROM Users WHERE username = '?'), ?, ?)"),

        ADD_POLL("INSERT INTO Polls VALUES (NULL, (Select person FROM Users WHERE username = '?'), '?')"),

        DELETE_POLL("DELETE FROM Polls WHERE poll_id = ?"),

        ADD_SLOT_TO_POLL("INSERT INTO poll_time VALUES (NULL, ?, ?)"),

        SET_POLL_RATING("INSERT INTO poll_time_ratings VALUES ("
        +"(Select person FROM Users WHERE username = '?'), (SELECT poll_slot_id "
        +"FROM poll_time pt WHERE pt.slot_id = ? AND pt.poll_id = ?), ?)"),

        ALTERNATIVES("SELECT ts.week_day, ts.time_slot "
        + "FROM (SELECT subject, class_type FROM Classes WHERE id_classes = ?) current_class, Classes Cl "
        + "JOIN time_slots ts using (time_slot_id) "
        +"WHERE Cl.subject = current_class.subject AND Cl.class_type = current_class.class_type");

        public final String QUERY;
        private QueriesMapper(String query)
        {
            this.QUERY = query;
        }
        public String getQuery()
        {
            return this.QUERY;
        }
}
