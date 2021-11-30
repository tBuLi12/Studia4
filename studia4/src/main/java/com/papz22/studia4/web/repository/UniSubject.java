package com.papz22.studia4.web.repository;

public class UniSubject
{
    private int id;
    private String name;
    private int ects;
    private String coordinator_id;
    private int department_id;
    private int exam;
    private int tests;
    private int practicals;

    public UniSubject(){}

    public UniSubject(int id, String name, int ects, String coordinator_id, int department_id, int exam, int tests, int practicals)
    {
        this.id = id;
        this.name = name;
        this.ects = ects;
        this.coordinator_id = coordinator_id;
        this.department_id = department_id;
        this.exam = exam;
        this.tests = tests;
        this.practicals = practicals;
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

    public int getEcts() {
        return this.ects;
    }

    public void setEcts(int ects) {
        this.ects = ects;
    }

    public String getCoordinator_id() {
        return this.coordinator_id;
    }

    public void setCoordinator_id(String coordinator_id) {
        this.coordinator_id = coordinator_id;
    }

    public int getDepartment_id() {
        return this.department_id;
    }

    public void setDepartment_id(int department_id) {
        this.department_id = department_id;
    }

    public int getExam() {
        return this.exam;
    }

    public void setExam(int exam) {
        this.exam = exam;
    }

    public int getTests() {
        return this.tests;
    }

    public void setTests(int tests) {
        this.tests = tests;
    }

    public int getPracticals() {
        return this.practicals;
    }

    public void setPracticals(int practicals) {
        this.practicals = practicals;
    }
}

