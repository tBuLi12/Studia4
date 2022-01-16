package com.papz22.studia4.repository;

public class Ratings {
    private String timeSlotID;
    private String rating;


    public Ratings() {
        
    }
    

    public String getTimeSlotId() {
        return this.timeSlotID;
    }

    public void setTimeSlotId(String timeSlotId) {
        this.timeSlotID = timeSlotId;
    }

    public String getRating() {
        return this.rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }
    
}
