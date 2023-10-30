package com.portalprojects.core.member.service;

import com.portalprojects.core.common.base.TodoAndTodoListObject;
import com.portalprojects.core.member.model.request.MeCreateTodoListRequest;
import com.portalprojects.core.member.model.request.MeDeleteTodoListRequest;
import com.portalprojects.core.member.model.request.MeUpdateNameTodoListRequest;
import com.portalprojects.core.member.model.request.MeUpdateTodoListRequest;
import com.portalprojects.core.member.model.response.MeTodoListResponse;
import com.portalprojects.entity.TodoList;
import jakarta.validation.Valid;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;

import java.util.List;

/**
 * @author thangncph26123
 */

public interface MeTodoListService {

    List<MeTodoListResponse> getAllTodoList(String idProject);

    TodoAndTodoListObject updateIndexTodoList(@Valid MeUpdateTodoListRequest request);

    TodoList createTodoList(@Valid MeCreateTodoListRequest request, StompHeaderAccessor headerAccessor);

    TodoList updateNameTodoList(@Valid MeUpdateNameTodoListRequest request);

    String deleteTodoList(@Valid MeDeleteTodoListRequest request);
}
