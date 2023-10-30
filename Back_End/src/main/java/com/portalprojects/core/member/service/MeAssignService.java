package com.portalprojects.core.member.service;

import com.portalprojects.core.common.base.TodoObject;
import com.portalprojects.core.member.model.request.MeCreateOrDeleteAssignRequest;
import jakarta.validation.Valid;

import java.util.List;

/**
 * @author thangncph26123
 */
public interface MeAssignService {

    List<String> getAllMemberByIdTodo(String idTodo);

    TodoObject create(@Valid MeCreateOrDeleteAssignRequest request);

    TodoObject delete(@Valid MeCreateOrDeleteAssignRequest request);

}
