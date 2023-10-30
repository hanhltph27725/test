package com.portalprojects.core.member.service.impl;

import com.portalprojects.core.common.base.TodoObject;
import com.portalprojects.core.member.model.request.MeCreateOrDeleteLabelTodoRequest;
import com.portalprojects.core.member.repository.MeLabelTodoRepository;
import com.portalprojects.core.member.service.MeLabelTodoService;
import com.portalprojects.entity.LabelProjectTodo;
import jakarta.transaction.Transactional;
import lombok.Synchronized;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

/**
 * @author thangncph26123
 */
@Service
@Validated
public class MeLabelTodoServiceImpl implements MeLabelTodoService {

    @Autowired
    private MeLabelTodoRepository meLabelTodoRepository;

    @Override
    @Synchronized
    @CacheEvict(value = {"allLabelsByProject", "labelsByTodo", "todosByFilter"}, allEntries = true)
    public TodoObject create(MeCreateOrDeleteLabelTodoRequest request) {
        LabelProjectTodo labelTodo = new LabelProjectTodo();
        labelTodo.setTodoId(request.getIdTodo());
        labelTodo.setLabelProjectId(request.getIdLabel());
        TodoObject todoObject = TodoObject.builder().data(meLabelTodoRepository.save(labelTodo)).idTodoList(request.getIdTodoList()).idTodo(request.getIdTodo()).build();
        return todoObject;
    }

    @Override
    @Synchronized
    @CacheEvict(value = {"allLabelsByProject", "labelsByTodo", "todosByFilter"}, allEntries = true)
    @Transactional
    public TodoObject delete(MeCreateOrDeleteLabelTodoRequest request) {
        meLabelTodoRepository.delete(request.getIdLabel(), request.getIdTodo());
        TodoObject todoObject = TodoObject.builder().data(request.getIdTodo()).idTodoList(request.getIdTodoList()).idTodo(request.getIdTodo()).build();
        return todoObject;
    }
}
