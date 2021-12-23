package com.papz22.studia4.repository;

import java.sql.Date;

public class Worker {
    
    private String pesel;
    private String name;
    private String surname;
    private Date birth_date;
    private String status;
    private int institution_id;
    private double salary;
    private String website;
    private Date date_employed;
    private int consultation;


    public String getPesel() {
        return this.pesel;
    }

    public void setPesel(String pesel) {
        this.pesel = pesel;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return this.surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public Date getBirth_date() {
        return this.birth_date;
    }

    public void setBirth_date(Date birth_date) {
        this.birth_date = birth_date;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getInstitution_id() {
        return this.institution_id;
    }

    public void setInstitution_id(int institution_id) {
        this.institution_id = institution_id;
    }

    public double getSalary() {
        return this.salary;
    }

    public void setSalary(double salary) {
        this.salary = salary;
    }

    public String getWebsite() {
        return this.website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public Date getDate_employed() {
        return this.date_employed;
    }

    public void setDate_employed(Date date_employed) {
        this.date_employed = date_employed;
    }

    public int getConsultation() {
        return this.consultation;
    }

    public void setConsultation(int consultation) {
        this.consultation = consultation;
    }


    //TODO FIX date conversion error
    @Override
    public String toString() {
        return String.format("Employee [pesel=%d, name=%s, surname=%s, birth_date=%d, status=%s, institution_id=%d, salary=%d, website=%d, date_employed=%d, consultation=%d]",
        pesel, name, surname, birth_date, status, institution_id, salary, website, date_employed, consultation);
    }
}
