package com.portalprojects.core.member.service.impl;

import com.portalprojects.core.common.base.TodoObject;
import com.portalprojects.core.member.model.request.MeCreateResourceRequest;
import com.portalprojects.core.member.model.request.MeDeleteResourceRequest;
import com.portalprojects.core.member.model.request.MeUpdateResourceRequest;
import com.portalprojects.core.member.model.response.MeResourceResponse;
import com.portalprojects.core.member.repository.MeActivityRepository;
import com.portalprojects.core.member.repository.MeReourceRepository;
import com.portalprojects.core.member.service.MeResourceService;
import com.portalprojects.entity.Activity;
import com.portalprojects.entity.Resource;
import com.portalprojects.infrastructure.constant.Message;
import com.portalprojects.infrastructure.exception.rest.MessageHandlingException;
import com.portalprojects.infrastructure.successnotification.ConstantMessageSuccess;
import com.portalprojects.infrastructure.successnotification.SuccessNotificationSender;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.Synchronized;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.List;
import java.util.Optional;

/**
 * @author thangncph26123
 */
@Service
@Validated
public class MeResourceServiceImpl implements MeResourceService {

    @Autowired
    private MeReourceRepository meReourceRepository;

    @Autowired
    private MeActivityRepository meActivityRepository;

    @Autowired
    private SuccessNotificationSender successNotificationSender;

    @Override
    public List<MeResourceResponse> getAll(String idTodo) {
        return meReourceRepository.getAll(idTodo);
    }

    @Override
    @Synchronized
    @CacheEvict(value = {"activityByIdTodo"}, allEntries = true)
    public TodoObject create(@Valid MeCreateResourceRequest request, StompHeaderAccessor headerAccessor) {
        Resource resource = new Resource();
        resource.setName(request.getName());
        if (request.getName().isEmpty() || request.getName() == null) {
            resource.setName(null);
        }
        resource.setName(request.getName());
        if (!request.getUrl().contains("http")) {
            resource.setUrl("http://" + request.getUrl());
        } else {
            resource.setUrl(request.getUrl());
        }
        resource.setTodoId(request.getIdTodo());

        Activity activity = new Activity();
        activity.setMemberCreatedId(request.getIdUser());
        activity.setTodoId(request.getIdTodo());
        activity.setTodoListId(request.getIdTodoList());
        activity.setProjectId(request.getProjectId());
        if (request.getName() != null && !request.getName().isEmpty()) {
            activity.setContentAction("đã đính kèm " + request.getName() + " vào thẻ này");
        } else {
            activity.setContentAction("đã đính kèm " + "http://" + request.getUrl() + " vào thẻ này");
        }
        successNotificationSender.senderNotification(ConstantMessageSuccess.THEM_THANH_CONG, headerAccessor);
        TodoObject todoObject = TodoObject.builder().data(meReourceRepository.save(resource))
                .dataActivity(meActivityRepository.save(activity))
                .idTodo(request.getIdTodo()).idTodoList(request.getIdTodoList()).build();
        return todoObject;
    }

    @Override
    @Synchronized
    @CacheEvict(value = {"activityByIdTodo"}, allEntries = true)
    @Transactional
    public TodoObject update(@Valid MeUpdateResourceRequest request, StompHeaderAccessor headerAccessor) {
        Optional<Resource> resourceFind = meReourceRepository.findById(request.getId());
        if(!resourceFind.isPresent()){
            throw new MessageHandlingException(Message.RESOURCE_NOT_EXISTS);
        }
        resourceFind.get().setName(request.getName());
        resourceFind.get().setUrl(request.getUrl());
        successNotificationSender.senderNotification(ConstantMessageSuccess.CAP_NHAT_THANH_CONG, headerAccessor);
        TodoObject todoObject = TodoObject.builder().data(meReourceRepository.save(resourceFind.get()))
                .idTodo(request.getIdTodo()).idTodoList(request.getIdTodoList()).build();
        return todoObject;
    }

    @Override
    @Synchronized
    @CacheEvict(value = {"activityByIdTodo"}, allEntries = true)
    @Transactional
    public TodoObject delete(@Valid MeDeleteResourceRequest request, StompHeaderAccessor headerAccessor) {
        Activity activity = new Activity();
        activity.setProjectId(request.getProjectId());
        activity.setTodoId(request.getIdTodo());
        activity.setTodoListId(request.getIdTodoList());
        activity.setMemberCreatedId(request.getIdUser());
        if(!request.getName().isEmpty() && request.getName() != null){
            activity.setContentAction("đã xóa link đính kèm " + request.getName() + " khỏi thẻ này");
        }else {
            activity.setContentAction("đã xóa link đính kèm " + request.getUrl() + " khỏi thẻ này");
        }
        successNotificationSender.senderNotification(ConstantMessageSuccess.XOA_THANH_CONG, headerAccessor);
        meReourceRepository.deleteById(request.getId());
        TodoObject todoObject = TodoObject.builder().data(request.getId())
                .dataActivity(meActivityRepository.save(activity))
                .idTodo(request.getIdTodo())
                .idTodoList(request.getIdTodoList()).build();
        return todoObject;
    }
}
