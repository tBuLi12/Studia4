package com.papz22.studia4.repository;

import java.util.ArrayList;

public class ClassesRegister {
    private String name;
    private String classType;
    private ArrayList<String> ids = new ArrayList<>();

    public ClassesRegister() {
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

    public ArrayList<String> getIds() {
        return this.ids;
    }

    public void setIds(ArrayList<String> ids) {
        this.ids = ids;
    }

}
