package com.papz22.studia4.repository;

import java.util.ArrayList;

public class Classes
{
    private int id;
    private String name;
    private int subject_id;
    private int classroom_id;
    private String week_day;
    private int week_day_number;
    private String starting_time;
    private int student_group;
    private int group_capacity;
    private String teacher_id;
    private int number_of_places;
    private String class_type;
    private String roomNumber;
    private int timeSlotID;
    private ArrayList<Integer> alternatives = new ArrayList<>();

    public Classes(){}



    public ArrayList<Integer> getAlternatives() {
        return this.alternatives;
    }
    
    public int getTimeSlotID() {
        return this.timeSlotID;
    }

    public void setTimeSlotID(int timeSlot) {
        this.timeSlotID = timeSlot;
    }

    public String getRoomNumber() {
        return this.roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getClass_type() {
        return this.class_type;
    }

    public void setClass_type(String class_type) {
        this.class_type = class_type;
    }

    public int getId() {
        return this.id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getSubject_id() {
        return this.subject_id;
    }

    public void setSubject_id(int subject_id) {
        this.subject_id = subject_id;
    }

    public int getClassroom_id() {
        return this.classroom_id;
    }

    public void setClassroom_id(int classroom_id) {
        this.classroom_id = classroom_id;
    }

    public String getWeek_day() {
        return this.week_day;
    }

    public void setWeek_day(String week_day) {
        this.week_day = week_day;
    }

    public int getWeek_day_number() {
        return this.week_day_number;
    }

    public void setWeek_day_number(int week_day_number) {
        this.week_day_number = week_day_number;
    }

    public String getStarting_time() {
        return this.starting_time;
    }

    public void setStarting_time(String starting_time) {
        this.starting_time = starting_time;
    }

    public int getStudent_group() {
        return this.student_group;
    }

    public void setStudent_group(int student_group) {
        this.student_group = student_group;
    }

    public int getGroup_capacity() {
        return this.group_capacity;
    }

    public void setGroup_capacity(int group_capacity) {
        this.group_capacity = group_capacity;
    }

    public String getTeacher_id() {
        return this.teacher_id;
    }

    public void setTeacher_id(String teacher_id) {
        this.teacher_id = teacher_id;
    }

    public int getNumber_of_places() {
        return this.number_of_places;
    }

    public void setNumber_of_places(int number_of_places) {
        this.number_of_places = number_of_places;
    }
}

