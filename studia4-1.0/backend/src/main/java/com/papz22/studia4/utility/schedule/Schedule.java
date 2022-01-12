package com.papz22.studia4.utility.schedule;

import java.util.HashSet;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Set;

class Schedule {
    Class[] classes;

    class Trace {
        Trace(Class x, int y) {
            from = x;
            removed = y;
        }
        Class from;
        int removed;
        void restore() {
            from.domain.add(removed);
        }
    }

    boolean backtrack() {
        Set<Integer> oldDomain;
        Class selected;
        for (Class c: classes) {
            if (c.domain.size() != 1) {
                selected = c;
                oldDomain = selected.domain;
                selected.domain = new HashSet<>();
                for (int val: oldDomain) {
                    selected.domain.add(val);
                    LinkedList<Trace> traces = makeArcConsistent();
                    if (backtrack()) {
                        return true;
                    }
                    selected.domain.clear();
                    for (Trace t: traces) { t.restore(); }
                }
                selected.domain = oldDomain;
                return false;
            }
        }
        return true;
    }

    LinkedList<Trace> makeArcConsistent() {
        Queue<Class> decided = new LinkedList<>();
        LinkedList<Trace> traces = new LinkedList<>();
        for (Class c: classes) {
            if (c.domain.size() == 1) {
                decided.add(c);
            }
        }

        while (!decided.isEmpty()) {
            Class c = decided.remove();
            int val = c.domain.iterator().next();
            for (Class neighbour: c.neighbours) {
                if (neighbour.domain.remove(val)) {
                    traces.add(new Trace(neighbour, val));
                    if (neighbour.domain.size() == 1) {
                        decided.add(neighbour);
                    } else if (neighbour.domain.size() == 0) {
                        for (Trace t: traces) { t.restore(); }
                        return null;
                    }
                } 
            }
        }
        return traces;
    }
}