package com.papz22.studia4.repository;

public class PollResult {
    private int slotId;
    private int pollID;
    private int rating;
    private String pollName;


    public PollResult() {
    }

    public String getPollName() {
        return this.pollName;
    }

    public int getPollID() {
        return this.pollID;
    }

    public void setPollID(int pollID) {
        this.pollID = pollID;
    }

    public void setPollName(String pollName) {
        this.pollName = pollName;
    }

    public int getSlotId() {
        return this.slotId;
    }

    public void setSlotId(int slotId) {
        this.slotId = slotId;
    }

    public int getRating() {
        return this.rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

}
