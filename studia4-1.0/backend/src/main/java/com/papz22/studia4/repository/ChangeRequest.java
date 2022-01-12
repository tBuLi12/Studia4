package com.papz22.studia4.repository;

public class ChangeRequest {
    private int requestId;
    private String name;
    private String classType;
    private String student;
    private String weekDay;
    private int timeSlotID;


    public ChangeRequest() {
    }

    public int getRequestId() {
        return this.requestId;
    }

    public void setRequestId(int requestId) {
        this.requestId = requestId;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getClassType() {
        return this.classType;
    }

    public void setClassType(String classType) {
        this.classType = classType;
    }

    public String getStudent() {
        return this.student;
    }

    public void setStudent(String student) {
        this.student = student;
    }

    public String getWeekDay() {
        return this.weekDay;
    }

    public void setWeekDay(String weekDay) {
        this.weekDay = weekDay;
    }

    public int getTimeSlotID() {
        return this.timeSlotID;
    }

    public void setTimeSlotID(int timeSlot) {
        this.timeSlotID = timeSlot;
    }


}
