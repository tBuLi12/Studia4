package com.papz22.studia4.utility.schedule;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;


class ScheduleSolver {
    Schedule schedule;
    ScheduleSolver(String[] classes, Map<String, String[]> collisions, int nSlots) {
        schedule.classes = new Class[classes.length];
        HashMap<String, Class> mapping = new HashMap<>();
        for (String cls: classes) {
            mapping.put(cls, new Class(cls));
        }
        for (int i = 0; i < classes.length; i++) {
            schedule.classes[i] = mapping.get(classes[i]);
            schedule.classes[i].domain = new HashSet<Integer>();
            for (int j = 0; j < nSlots; j++) schedule.classes[i].domain.add(j);
            for (String colCls: collisions.get(classes[i])) {
                schedule.classes[i].neighbours.add(mapping.get(colCls));
            }
        }
    }
    HashMap<String, Integer> solve() {
        schedule.backtrack();
        HashMap<String, Integer> res = new HashMap<>();
        for (Class cls: schedule.classes) {
            res.put(cls.name, cls.domain.iterator().next());
        }
        return res;
    }
}




