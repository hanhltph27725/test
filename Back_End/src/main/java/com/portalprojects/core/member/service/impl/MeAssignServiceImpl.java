package com.portalprojects.core.member.service.impl;

import com.portalprojects.core.common.base.TodoObject;
import com.portalprojects.core.member.model.request.MeCreateOrDeleteAssignRequest;
import com.portalprojects.core.member.repository.MeActivityRepository;
import com.portalprojects.core.member.repository.MeAssignRepository;
import com.portalprojects.core.member.service.MeAssignService;
import com.portalprojects.entity.Activity;
import com.portalprojects.entity.Assign;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.Synchronized;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.List;

/**
 * @author thangncph26123
 */
@Service
@Validated
public class MeAssignServiceImpl implements MeAssignService {

    @Autowired
    private MeAssignRepository meAssignRepository;

    @Autowired
    private MeActivityRepository meActivityRepository;
    
    @Override
    @Cacheable(value = "membersByTodo", key = "#idTodo")
    public List<String> getAllMemberByIdTodo(String idTodo) {
        return meAssignRepository.getAllMemberByIdTodo(idTodo);
    }

    @Override
    @CacheEvict(value = {"membersByTodo", "activityByIdTodo", "todosByFilter"}, allEntries = true)
    @Synchronized
    @Transactional
    public TodoObject delete(@Valid MeCreateOrDeleteAssignRequest request) {
        meAssignRepository.delete(request.getIdMember(), request.getIdTodo());
        Activity activity = new Activity();

        if(request.getIdMember().equals(request.getIdUser())){
            activity.setProjectId(request.getProjectId());
            activity.setTodoId(request.getIdTodo());
            activity.setTodoListId(request.getIdTodoList());
            activity.setMemberCreatedId(request.getIdUser());
            activity.setContentAction("đã rời khỏi thẻ này");
        } else {
            activity.setProjectId(request.getProjectId());
            activity.setTodoId(request.getIdTodo());
            activity.setTodoListId(request.getIdTodoList());
            activity.setMemberCreatedId(request.getIdUser());
            activity.setMemberId(request.getIdMember());
            activity.setContentAction("đã xóa " + request.getNameMember() + " khỏi thẻ này");
        }
        TodoObject todoObject = TodoObject.builder().data(request.getIdTodo())
                .dataActivity(meActivityRepository.save(activity)).idTodoList(request.getIdTodoList())
                .idTodo(request.getIdTodo()).build();
        return todoObject;
    }

    @Override
    @CacheEvict(value = {"membersByTodo", "activityByIdTodo", "todosByFilter"}, allEntries = true)
    @Synchronized
    public TodoObject create(@Valid MeCreateOrDeleteAssignRequest request) {
        Assign assign = new Assign();
        assign.setTodoId(request.getIdTodo());
        assign.setEmail(request.getEmail());
        assign.setMemberId(request.getIdMember());

        Activity activity = new Activity();
        if(request.getIdMember().equals(request.getIdUser())){
            activity.setProjectId(request.getProjectId());
            activity.setTodoId(request.getIdTodo());
            activity.setTodoListId(request.getIdTodoList());
            activity.setMemberCreatedId(request.getIdUser());
            activity.setContentAction("đã tham gia thẻ này");
        } else {
            activity.setProjectId(request.getProjectId());
            activity.setTodoId(request.getIdTodo());
            activity.setTodoListId(request.getIdTodoList());
            activity.setMemberCreatedId(request.getIdUser());
            activity.setMemberId(request.getIdMember());
            activity.setContentAction("đã thêm " + request.getNameMember() + " vào thẻ này");
        }

        TodoObject todoObject = TodoObject.builder().data(meAssignRepository.save(assign)).
        dataActivity(meActivityRepository.save(activity)).
                idTodoList(request.getIdTodoList()).idTodo(request.getIdTodo()).build();
        return todoObject;
    }
}
