package com.papz22.studia4.webconf;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Map;
import java.util.TreeMap;

import com.papz22.studia4.repository.Alternative;
import com.papz22.studia4.repository.ChangeRequest;
import com.papz22.studia4.repository.Classes;
import com.papz22.studia4.repository.PollResult;
import com.papz22.studia4.repository.UniSubject;
import com.papz22.studia4.utility.ParametersValidator;
import com.papz22.studia4.utility.exception.InvalidGetParameterException;
import com.papz22.studia4.utility.jdbc.JDCBConnection;
import com.papz22.studia4.utility.jdbc.PeselExtractor;
import com.papz22.studia4.utility.jdbc.QueriesMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Studia4Controller {

    @Autowired
    JDCBConnection connection;

    @Autowired
    PeselExtractor extractor;

    @GetMapping("/courses")
    ArrayList<UniSubject> getCourses(Authentication auth) {
        ArrayList<UniSubject> clss = new ArrayList<>();
        ArrayList<String> params = new ArrayList<>();
        params.add(auth.getName());
        try (ResultSet rs = connection.getQueryResult(QueriesMapper.COURSES, params);){
            UniSubject cls;
            while (rs.next()) {
                cls = new UniSubject();
                cls.setId(rs.getInt("sbj_subject_id"));
                cls.setName(rs.getString("sbj_name"));
                clss.add(cls);
            }
            rs.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return clss;
    }

    @GetMapping("/classes")
    ArrayList<Classes> getClasses(Authentication auth, @RequestParam(required = false) String flag) {
        
        ArrayList<Classes> lectures = new ArrayList<>();
        ArrayList<String> params = new ArrayList<>();
        params.add(auth.getName());
        try (ResultSet rs = connection.getQueryResult(QueriesMapper.CLASSES, params);){
            Classes lecture;
            while (rs.next()) {
                lecture = new Classes();
                lecture.setId(rs.getInt("id_classes"));
                lecture.setName(rs.getString("name"));
                lecture.setClass_type(rs.getString("class_type"));
                lecture.setRoomNumber(rs.getString("room_nr"));
                lecture.setWeek_day(rs.getString("week_day"));
                lecture.setTimeSlotID(rs.getInt("time_slot_id"));
                lectures.add(lecture);
            }
            rs.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        if(flag != null)
                {
                    for (Classes lec : lectures){
                Integer id = lec.getId();
                ArrayList<String> sub_params = new ArrayList<>();
                sub_params.add(id.toString());
                try (ResultSet rs_sub = connection.getQueryResult(QueriesMapper.ALTERNATIVES, sub_params);){
                    Alternative alt;
                    while (rs_sub.next()) {
                        alt = new Alternative();
                        alt.setTimeSlot(rs_sub.getString("time_slot"));
                        alt.setWeekDay(rs_sub.getString("week_day"));
                        lec.getAlternatives().add(alt);
                    }
                    rs_sub.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
                }
            }
        return lectures;
    }


    @GetMapping("/logged")
    Map<String, String> getLoggedUser(Authentication authentication)
    {
        Map<String, String> credentials = new TreeMap<>();
        credentials.put("username", authentication.getName());
        boolean isUser = authentication.getAuthorities().stream()
          .anyMatch(r -> r.getAuthority().equals("ROLE_USER"));
        String group = isUser ? "ROLE_USER" : "ROLE_ADMIN";
        boolean isEmployee = authentication.getAuthorities().stream()
          .anyMatch(r -> r.getAuthority().equals("ROLE_EMPLOYEE"));
        String workGroup = isEmployee ? "ROLE_EMPLOYEE" : "ROLE_STUDENT";
        credentials.put("security", group);
        credentials.put("position", workGroup);
        return credentials;
    }

    @GetMapping("/build-schedule")
    void buildSchedule()
    {

    }

    @GetMapping("/delete")
    void delete(@RequestParam String id){
    ArrayList<String> params = new ArrayList<>();
        params.add(id);
    {
        try {connection.executeUpdateOrDelete(QueriesMapper.DELETE_REQUEST_CHANGE_GROUP, params);
        }catch(SQLException e){
            e.printStackTrace();
            }
        }
    }

    @GetMapping("/requests")
    ArrayList<ChangeRequest> getChangeRequests(Authentication auth) {
        ArrayList<ChangeRequest> requests = new ArrayList<>();
        ArrayList<String> params = new ArrayList<>();
        params.add(auth.getName());
        try (ResultSet rs = connection.getQueryResult(QueriesMapper.REQUESTS, params);){
            ChangeRequest req;
            while (rs.next()) {
                req = new ChangeRequest();
                req.setRequestId(rs.getInt("request_id"));
                req.setName(rs.getString("name"));
                req.setStudent(rs.getString("student"));
                req.setWeekDay(rs.getString("week_day"));
                req.setTimeSlotID(rs.getInt("time_slot_id"));
                requests.add(req);
            }
            rs.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return requests;
    }

    @PostMapping("/set-poll-rating")
    void setPollRatings(@RequestParam ArrayList<String> slotIDs, @RequestParam String pollID, @RequestParam ArrayList<String> ratings) 
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ArrayList<String> params;
        String username = authentication.getName();
        try
        {
            for (int i = 0; i < slotIDs.size(); i++){
            params = new ArrayList<>();
            ParametersValidator.isInteger(slotIDs.get(i));
            ParametersValidator.isInteger(pollID);
            ParametersValidator.isInteger(ratings.get(i));
            params.add(username);
            params.add(slotIDs.get(i));
            params.add(pollID);
            params.add(ratings.get(i));
            try {
                connection.executeUpdateOrDelete(QueriesMapper.INSERT_POLL_RATING, params);
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        } catch(InvalidGetParameterException e) {
            e.printStackTrace();
        }
    }

    @PostMapping("/delete-poll")
    void deletePoll(@RequestParam String pollID) 
    {
        ArrayList<String> params = new ArrayList<>();
        try
        {
            ParametersValidator.isInteger(pollID);
            params.add(pollID);
            try {
                connection.executeUpdateOrDelete(QueriesMapper.DELETE_POLL, params);
            } catch (SQLException e) {
                e.printStackTrace();
            }
        } catch(InvalidGetParameterException e) {
            e.printStackTrace();
        }
    }
    
    @PostMapping("/add-poll")
    void addPoll(@RequestParam String name, @RequestParam ArrayList<String> slots) 
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        ArrayList<String> params = new ArrayList<>();
        params.add(username);
        params.add(name);
        try {
            // adds new table with username and pollname - generates incremently id
            connection.executeUpdateOrDelete(QueriesMapper.ADD_POLL, params);
            ResultSet rs = connection.getQueryResut(QueriesMapper.GET_MAX_POLL_ID);
            // generated poll id 
            rs.next();
            String maxPollId = rs.getString("MAX");
            rs.close();
            ArrayList<String> subParams;
            for(String slot : slots)
            {
                // for every time slot add new time slot matching with id
                subParams = new ArrayList<>();
                subParams.add(slot);
                subParams.add(maxPollId);
                connection.executeUpdateOrDelete(QueriesMapper.ADD_SLOT_TO_POLL, subParams);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }


    @GetMapping("/poll-result")
    ArrayList<PollResult> getPollResult(@RequestParam String pollID)
    {
        ArrayList<PollResult> polls = new ArrayList<>();
        ArrayList<String> params = new ArrayList<>();
        params.add(pollID);
        try (ResultSet rs = connection.getQueryResult(QueriesMapper.POLL_RESULT, params);){
            PollResult poll;
            while (rs.next()) {
                poll = new PollResult();
                poll.setSlotId(rs.getInt("slot_id"));
                poll.setRating(rs.getInt("rating"));
                polls.add(poll);
            }
            rs.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return polls;
    }


    @GetMapping("/polls")
    ArrayList<PollResult> getPolls(@RequestParam String pollID)
    {
        ArrayList<PollResult> polls = new ArrayList<>();
        ArrayList<String> params = new ArrayList<>();
        params.add(pollID);
        try (ResultSet rs = connection.getQueryResult(QueriesMapper.FETCH_POLLS, params);){
            PollResult poll;
            while (rs.next()) {
                poll = new PollResult();
                poll.setPollID(rs.getInt("poll_id"));
                poll.setPollName(rs.getString("poll_name"));
                polls.add(poll);
            }
            rs.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return polls;
    }


    // @PostMapping("set-ratings")
    // void setRatings(Authentication authentication, @RequestPart String slot, @RequestPart String rating) 
    // {
    //     System.out.println(pollName);
    //     String username = authentication.getName();
    //     ArrayList<String> params = new ArrayList<>();
    //     params.add(username);
    //     params.add(pollName);
    //         try {
    //             connection.executeUpdateOrDelete(QueriesMapper.ADD_POLL, params);
    //         } catch (SQLException e) {
    //             e.printStackTrace();
    //         }
    // }


}