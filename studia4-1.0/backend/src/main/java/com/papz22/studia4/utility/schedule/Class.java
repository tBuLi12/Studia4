package com.papz22.studia4.utility.schedule;

import java.util.HashSet;
import java.util.Set;

class Class {
    Class(String nm) {
        name = nm;
        neighbours = new HashSet<>();
    }
    String name;
    Set<Class> neighbours;
    Set<Integer> domain; 
}

