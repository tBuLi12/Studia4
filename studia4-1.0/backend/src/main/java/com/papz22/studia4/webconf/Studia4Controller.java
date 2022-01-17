package com.papz22.studia4.webconf;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

import com.papz22.studia4.repository.Alternative;
import com.papz22.studia4.repository.ChangeRequest;
import com.papz22.studia4.repository.Classes;
import com.papz22.studia4.repository.ClassesRegister;
import com.papz22.studia4.repository.PollResult;
import com.papz22.studia4.repository.Ratings;
import com.papz22.studia4.repository.UniSubject;
import com.papz22.studia4.utility.ParametersValidator;
import com.papz22.studia4.utility.exception.InvalidRequestParameterException;
import com.papz22.studia4.utility.jdbc.JDCBConnection;
import com.papz22.studia4.utility.jdbc.PeselExtractor;
import com.papz22.studia4.utility.jdbc.QueriesMapper;
import com.papz22.studia4.utility.schedule.ScheduleSolver;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Studia4Controller {


    @Autowired
    PeselExtractor extractor;

    @GetMapping("/courses")
    ArrayList<UniSubject> getCourses(Authentication auth, @RequestParam(required = false) String all) {
        ArrayList<UniSubject> clss = new ArrayList<>();
        ArrayList<String> params = new ArrayList<>();
        if(all == null) all = "";
        params.add(auth.getName());
        try{
        JDCBConnection connection = new JDCBConnection();
       
        ResultSet rs = (!all.matches("true")) ? connection.getQueryResult(QueriesMapper.COURSES, params) : connection.getQueryResut(QueriesMapper.ALL_COURSES);
            UniSubject cls;
            while (rs.next()) {
                cls = new UniSubject();
                cls.setId(rs.getInt("subject_id"));
                cls.setName(rs.getString("name"));
                clss.add(cls);
            }
            rs.close();
            connection.closeConnection();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return clss;
    }

    @GetMapping("/classes")
    ArrayList<Classes> getClasses(Authentication auth, @RequestParam(required = false) String flag) {
        ArrayList<Classes> lectures = new ArrayList<>();
        ArrayList<String> params = new ArrayList<>();
        QueriesMapper query = QueriesMapper.ALL_CLASSES;
        if (flag == null) flag = "empty";
        if(!flag.equals("all")){
        params.add(auth.getName());
        query = QueriesMapper.CLASSES;
        }
        //TODO get everything in one try catch block
        try {
            JDCBConnection connection = new JDCBConnection();
            ResultSet rs = (!flag.equals("all")) ? connection.getQueryResult(query, params) : connection.getQueryResut(query);
            Classes lecture;
            while (rs.next()) {
                lecture = new Classes();
                lecture.setId(rs.getInt("id_classes"));
                lecture.setName(rs.getString("name"));
                lecture.setClass_type(rs.getString("class_type"));
                lecture.setRoomNumber(rs.getString("room_nr"));
                lecture.setWeek_day(rs.getString("week_day"));
                lecture.setTimeSlotID(rs.getInt("time_slot_id"));
                if(!query.getQuery().matches(QueriesMapper.ALL_CLASSES.getQuery())){
                String request = rs.getString("new_time_slot_id");
                lecture.setRequestedTimeSlotID(request);
                }
                lectures.add(lecture);
            }
            rs.close();
            connection.closeConnection();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        if(flag.equals("alts"))
                {
                    for (Classes lec : lectures){
                Integer id = lec.getId();
                ArrayList<String> sub_params = new ArrayList<>();
                sub_params.add(id.toString());
                try {
                    JDCBConnection connection = new JDCBConnection();
                    ResultSet rs_sub = connection.getQueryResult(QueriesMapper.ALTERNATIVES, sub_params);
                    Alternative alt;
                    while (rs_sub.next()) {
                        alt = new Alternative();
                        alt.setClassID(rs_sub.getString("id_classes"));
                        alt.setTimeSlotID(rs_sub.getString("time_slot_id"));
                        lec.getAlternatives().add(alt);
                    }
                    rs_sub.close();
                    connection.closeConnection();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
                }
            }
        return lectures;
    }

    @GetMapping("/reg-classes")
    ArrayList<ClassesRegister> getRegClasses(Authentication auth) {
        ArrayList<ClassesRegister> regs = new ArrayList<>();
        //TODO get everything in one try catch block
        try {
            JDCBConnection connection = new JDCBConnection();
            ClassesRegister reg;
            ResultSet rs = connection.getQueryResut(QueriesMapper.CLASSES_REGISTER);
            while (rs.next()) {
                reg = new ClassesRegister();
                reg.setName(rs.getString("name"));
                reg.setClassType(rs.getString("class_type"));
                regs.add(reg);
                }
                rs.close();
            connection.closeConnection();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        //TODO check loops
            try {
                JDCBConnection connection = new JDCBConnection();
                for (ClassesRegister rg : regs){
                    ArrayList<String> params = new ArrayList<>();
                    params.add(rg.getName());
                    params.add(rg.getClassType());
                    ResultSet rs_sub = connection.getQueryResult(QueriesMapper.CLASSES_REGISTER_PROPERTY, params);
                    while (rs_sub.next()) {
                        rg.getIds().add(rs_sub.getString("time_slot_id"));
                    }
                    rs_sub.close();
            }
                
            connection.closeConnection();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        return regs;
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

    // @GetMapping("/delete")
    // void delete(@RequestParam String id){
    // ArrayList<String> params = new ArrayList<>();
    //     params.add(id);
    // {
    //     try {
    //         JDCBConnection connection = new JDCBConnection();
    //         connection.executeUpdateOrDelete(QueriesMapper.DELETE_REQUEST_CHANGE_GROUP, params);
    //         connection.closeConnection();
    //     }catch(SQLException e){
    //         e.printStackTrace();
    //         }
    //     }
    // }

    @GetMapping("/requests")
    ArrayList<ChangeRequest> getChangeRequests(Authentication auth) {
        ArrayList<ChangeRequest> requests = new ArrayList<>();
        ArrayList<String> params = new ArrayList<>();
        params.add(auth.getName());
        try{
            JDCBConnection connection = new JDCBConnection(); 
            ResultSet rs = connection.getQueryResult(QueriesMapper.REQUESTS, params);
            ChangeRequest req;
            while (rs.next()) {
                req = new ChangeRequest();
                req.setRequestId(rs.getInt("request_id"));
                req.setName(rs.getString("name"));
                req.setStudent(rs.getString("stud_name"));
                req.setSurname(rs.getString("surname"));
                req.setTimeSlotID(rs.getInt("time_slot_id"));
                requests.add(req);
            }
            rs.close();
            connection.closeConnection();
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
        try{
            JDCBConnection connection = new JDCBConnection();
            for (int i = 0; i < slotIDs.size(); i++){
                params = new ArrayList<>();
                ParametersValidator.isInteger(slotIDs.get(i));
                ParametersValidator.isInteger(pollID);
                ParametersValidator.isInteger(ratings.get(i));
                params.add(username);
                params.add(slotIDs.get(i));
                params.add(pollID);
                params.add(ratings.get(i));
                connection.executeUpdateOrDelete(QueriesMapper.INSERT_POLL_RATING, params);
        }
            connection.closeConnection();
        } catch(InvalidRequestParameterException e) {
            e.printStackTrace();
        } catch(SQLException e) {
            e.printStackTrace();
        }
    }

    @PostMapping("/delete-poll")
    @Transactional
    void deletePoll(@RequestParam String pollID) 
    {
        try
        {
            JDCBConnection connection = new JDCBConnection();
            ParametersValidator.isInteger(pollID);
            connection.executeUpdateOrDelete(QueriesMapper.DELETE_POLL, pollID);
            connection.closeConnection();
        } catch(InvalidRequestParameterException e) {
            e.printStackTrace();
        } catch(SQLException e) {
            e.printStackTrace();
        }
    }
    
    @PostMapping("/add-poll")
    @Transactional
    PollResult addPoll(@RequestParam String name, @RequestParam ArrayList<String> slots, @RequestParam ArrayList<String> classIDs) 
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        ArrayList<String> params = new ArrayList<>();
        params.add(username);
        params.add(name);
        String maxPollId = "";
        int  maxPollIdInt = 0;
        try {
            JDCBConnection connection = new JDCBConnection();
            // adds new table with username and pollname - generates incremently id
            connection.executeUpdateOrDelete(QueriesMapper.ADD_POLL, params);
            try(ResultSet rs = connection.getQueryResut(QueriesMapper.GET_MAX_POLL_ID);){
            // generated poll id 
            rs.next();
            maxPollId = rs.getString("MAX");
            maxPollIdInt = rs.getInt("MAX");
            rs.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
            ArrayList<String> subParams;
            for(String slot : slots)
            {
                // for every time slot add new time slot matching with id
                subParams = new ArrayList<>();
                subParams.add(slot);
                subParams.add(maxPollId);
                connection.executeUpdateOrDelete(QueriesMapper.ADD_SLOT_TO_POLL, subParams);
            }
            connection.executeUpdateOrDeleteListWithString(QueriesMapper.ADD_POLL_TIME_RATINGS, maxPollId, classIDs);
            connection.closeConnection();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        PollResult result = new PollResult();
        result.setPollID(maxPollIdInt);
        result.setPollName(name);
        return result;
    }


    @GetMapping("/poll-result")
    ArrayList<PollResult> getPollResult(@RequestParam String pollID)
    {
        ArrayList<PollResult> polls = new ArrayList<>();
        ArrayList<String> params = new ArrayList<>();
        params.add(pollID);
        try {
            JDCBConnection connection = new JDCBConnection();
            ResultSet rs = connection.getQueryResult(QueriesMapper.POLL_RESULT, params);
            PollResult poll;
            while (rs.next()) {
                poll = new PollResult();
                poll.setSlotId(rs.getInt("slot_id"));
                poll.setRating(rs.getInt("rating"));
                polls.add(poll);
            }
            rs.close();
            connection.closeConnection();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return polls;
    }


    @GetMapping("/polls")
    ArrayList<PollResult> getPolls(Authentication auth)
    {
        ArrayList<PollResult> polls = new ArrayList<>();
        ArrayList<String> params = new ArrayList<>();
        params.add(auth.getName());
        try {
            JDCBConnection connection = new JDCBConnection();
            ResultSet rs;
            if (!SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
            .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_STUDENT"))){
                rs = connection.getQueryResult(QueriesMapper.FETCH_POLLS, params);
            } else {
                rs = connection.getQueryResult(QueriesMapper.GET_STUDENT_POLLS, params);
            }
            PollResult poll;
            while (rs.next()) {
                poll = new PollResult();
                poll.setPollID(rs.getInt("poll_id"));
                poll.setPollName(rs.getString("poll_name"));
                polls.add(poll);
            }
            rs.close();
            connection.closeConnection();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return polls;
    }


    @PostMapping("/intersect")
    ArrayList<String> postIntersect(@RequestParam ArrayList<String> classIDs)
    {
        ArrayList<String> slotIDs = new ArrayList<>();
        try {
            JDCBConnection connection = new JDCBConnection();
            ResultSet rs = connection.getListQueryResultSet(QueriesMapper.FETCH_INTERSECT, classIDs);
            while (rs.next()) {
                slotIDs.add(rs.getString("time_slot_id"));
            }
            rs.close();
            connection.closeConnection();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return slotIDs;
    }

    @PostMapping("/add-reschedule")
    void addReschedule(@RequestParam ArrayList<String> froms, @RequestParam ArrayList<String> tos) 
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ArrayList<String> params;
        try
        {
            //TODO getQueryResultSet with String Param
            JDCBConnection connection = new JDCBConnection();
            String pesel = extractor.extract(authentication);
            if (froms.size() != tos.size()) throw new InvalidRequestParameterException("Correlated params lists sizes not matching!");
            for (int i = 0; i < froms.size(); i++)
            {
                ParametersValidator.isInteger(froms.get(i));
                ParametersValidator.isInteger(tos.get(i));
                params = new ArrayList<String>();
                params.add(pesel);
                params.add(froms.get(i));
                params.add(tos.get(i));
                connection.executeUpdateOrDelete(QueriesMapper.DELETE_ADD_RESCHEDULE, new ArrayList<String>(params.subList(0, 2)));
                if (!params.get(1).matches(params.get(2))) connection.executeUpdateOrDelete(QueriesMapper.ADD_RESCHEDULE, params);
            }
            connection.closeConnection();
        } catch(InvalidRequestParameterException e) {
            e.printStackTrace();
        } catch(SQLException e) {
            e.printStackTrace();
        }
    }


    @GetMapping("/ratings")
    ArrayList<Ratings> getRatings(Authentication auth)
    {
        ArrayList<Ratings> ratings = new ArrayList<>();
        ArrayList<String> params = new ArrayList<>();
        params.add(auth.getName());
        try {
            JDCBConnection connection = new JDCBConnection();
            ResultSet rs = connection.getQueryResult(QueriesMapper.RATINGS, params);
            Ratings rating;
            while (rs.next()) {
                rating = new Ratings();
                rating.setTimeSlotID(rs.getString("time_slot_id"));
                rating.setRating(rs.getInt("rating"));
                ratings.add(rating);
            }
            rs.close();
            connection.closeConnection();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return ratings;
    }


    @PostMapping("/add-ratings")
    void addRating(@RequestParam ArrayList<String> slotIDs, @RequestParam ArrayList<String> ratings) 
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ArrayList<String> params;
        try
        {
            //TODO getQueryResultSet with String Param
            JDCBConnection connection = new JDCBConnection();
            for (int i = 0; i < slotIDs.size(); i++)
            {
                if (slotIDs.size() != ratings.size()) throw new InvalidRequestParameterException("Correlated params lists sizes not matching!");
                ParametersValidator.isInteger(slotIDs.get(i));
                ParametersValidator.isInteger(ratings.get(i));
                params = new ArrayList<String>();
                // params.add(authentication.getName());
                // params.add(slotIDs.get(i));
                // params.add(ratings.get(i));
                // ResultSet rs = connection.getQueryResult(QueriesMapper.CHECK_RATINGS, new ArrayList<String>(params.subList(0, 2)));
                // if (rs.next()) {
                    // first time added user
                    // ArrayList<String> sub_params = new ArrayList<>();
                    params.add(ratings.get(i));
                    params.add(extractor.extract(authentication));
                    params.add(slotIDs.get(i));
                    connection.executeUpdateOrDelete(QueriesMapper.UPDATE_RATING, params);
                // } else {
                // connection.executeUpdateOrDelete(QueriesMapper.ADD_RATING, params);
                // }
            }
            connection.closeConnection();
        } catch(InvalidRequestParameterException e) {
            e.printStackTrace();
        } catch(SQLException e) {
            e.printStackTrace();
        }
    }


    @PostMapping("/vote-poll")
    @Transactional
    void votePoll(@RequestParam String pollId, @RequestParam ArrayList<String> slotIds, @RequestParam ArrayList<String> ratings) 
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ArrayList<String> params;
        try
        {
            //TODO getQueryResultSet with String Param
            String username = authentication.getName();
            ParametersValidator.isInteger(pollId);
            if (slotIds.size() != ratings.size()) throw new InvalidRequestParameterException("Correlated params lists sizes not matching!");
            for (int i = 0; i < slotIds.size(); i++)
            {
                JDCBConnection connection = new JDCBConnection();
                ParametersValidator.isInteger(ratings.get(i));
                ParametersValidator.isInteger(ratings.get(i));
                params = new ArrayList<String>();
                params.add(ratings.get(i));
                params.add(username);
                params.add(slotIds.get(i));
                params.add(pollId);
                connection.executeUpdateOrDelete(QueriesMapper.UPDATE_POLL_RATING, params);
                connection.closeConnection();
            }
        } catch(InvalidRequestParameterException e) {
            e.printStackTrace();
        } catch(SQLException e) {
            e.printStackTrace();
        }
    }

    @GetMapping("/poll")
    ArrayList<Ratings> getRating(@RequestParam String pollId)
    {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ArrayList<Ratings> ratings = new ArrayList<>();
        ArrayList<String> params = new ArrayList<>();
        params.add(pollId);
        params.add(auth.getName());
        try {
            JDCBConnection connection = new JDCBConnection();
            ResultSet rs = connection.getQueryResult(QueriesMapper.POLL_RATINGS, params);
            Ratings rating;
            while (rs.next()) {
                rating = new Ratings();
                rating.setTimeSlotID(rs.getString("slot_id"));
                rating.setRating(rs.getInt("rating"));
                ratings.add(rating);
            }
            rs.close();
            connection.closeConnection();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return ratings;
    }

    @PostMapping("/request")
    void doRequest(@RequestParam String id, @RequestParam String action) 
    {
        try
        {
            JDCBConnection connection = new JDCBConnection();
            ParametersValidator.isInteger(id);
            if (action.matches("approve")) {
                connection.executeUpdateOrDelete(QueriesMapper.RESCHEDULE, id);
            } 
            connection.executeUpdateOrDelete(QueriesMapper.DELETE_REQUEST_CHANGE_GROUP, id);
            connection.closeConnection();
        } catch(InvalidRequestParameterException e) {
            e.printStackTrace();
        } catch(SQLException e) {
            e.printStackTrace();
        }
    }

    @PostMapping("/subject-register")
    void subjectRegister(@RequestParam String id) 
    {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ArrayList<String> params = new ArrayList<>();
        params.add(extractor.extract(auth));
        params.add(id);
        try
        {
            JDCBConnection connection = new JDCBConnection();
            ParametersValidator.isInteger(id);
            connection.executeUpdateOrDelete(QueriesMapper.SUBJECT_REGISTER, params);
            connection.closeConnection();
        } catch(InvalidRequestParameterException e) {
            e.printStackTrace();
        } catch(SQLException e) {
            e.printStackTrace();
        }
    } 

    @PostMapping("/class-register")
    void subjectRegister(@RequestParam String name, @RequestParam String type, @RequestParam String slotId) 
    {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ArrayList<String> params = new ArrayList<>();
        params.add(extractor.extract(auth));
        params.add(name);
        params.add(type);
        params.add(slotId);
        try
        {
            JDCBConnection connection = new JDCBConnection();
            ParametersValidator.isInteger(slotId);
            connection.executeUpdateOrDelete(QueriesMapper.CLASS_REGISTER, params);
            connection.closeConnection();
        } catch(InvalidRequestParameterException e) {
            e.printStackTrace();
        } catch(SQLException e) {
            e.printStackTrace();
        }
    }

    @GetMapping("build-schedule")
    void buildSchedule()
    {
        final int N_SLOTS = 30;
        if (!SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
            .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"))) return;
            HashMap<String, String[]> collisions = new HashMap<>();

        try
        {
            JDCBConnection connection = new JDCBConnection();
            ResultSet rs = connection.getQueryResut(QueriesMapper.BUILD_SCHEDULE_GET_CLASSIDS);
            ArrayList<String> result = new ArrayList<>();
            while(rs.next()) {
                result.add(rs.getString("id_classes"));
                
            }
            
            String[] classIDs = result.toArray(new String[0]);
            rs.close();
            for (String id : classIDs)
            {
                ArrayList<String> subResult = new ArrayList<>();
                ResultSet subRs = connection.getQueryResultSet(QueriesMapper.BUILD_SCHEDULE_GET_COLLISIONS, id);
                while(subRs.next())
                {
                    subResult.add(subRs.getString("id_classes"));
                }
                String[] collsIDs = subResult.toArray(new String[subResult.size()]);
                collisions.put(id, collsIDs);
            }
            ScheduleSolver solver = new ScheduleSolver(classIDs, collisions, N_SLOTS);
            HashMap<String, Integer> solvedSchedule = solver.solve();
            for (Map.Entry<String, Integer> entry : solvedSchedule.entrySet())
            {
                ArrayList<String> subParams = new ArrayList<>();
                int inceremented = entry.getValue() + 1;
                subParams.add(Integer.toString(inceremented));
                subParams.add(entry.getKey());
                connection.executeUpdateOrDelete(QueriesMapper.BUILD_SCHEDULE_SET_TIME, subParams);
            }
            connection.closeConnection();
        } catch(SQLException e) {
            e.printStackTrace();
        }
    }

}