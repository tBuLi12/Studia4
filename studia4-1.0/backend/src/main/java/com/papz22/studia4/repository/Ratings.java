package com.papz22.studia4.repository;

public class Ratings {
    private String timeSlotID;
    private int rating;


    public Ratings() {
        
    }
    

    public String getTimeSlotID() {
        return this.timeSlotID;
    }

    public void setTimeSlotID(String timeSlotID) {
        this.timeSlotID = timeSlotID;
    }

    public int getRating() {
        return this.rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }
    
}
