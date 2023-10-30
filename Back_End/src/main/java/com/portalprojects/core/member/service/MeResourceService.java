package com.portalprojects.core.member.service;

import com.portalprojects.core.common.base.TodoObject;
import com.portalprojects.core.member.model.request.MeCreateResourceRequest;
import com.portalprojects.core.member.model.request.MeDeleteResourceRequest;
import com.portalprojects.core.member.model.request.MeUpdateResourceRequest;
import com.portalprojects.core.member.model.response.MeResourceResponse;
import jakarta.validation.Valid;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;

import java.util.List;

/**
 * @author thangncph26123
 */
public interface MeResourceService {

    List<MeResourceResponse> getAll(String idTodo);

    TodoObject create(@Valid MeCreateResourceRequest request, StompHeaderAccessor headerAccessor);

    TodoObject update(@Valid MeUpdateResourceRequest request, StompHeaderAccessor headerAccessor);

    TodoObject delete(@Valid MeDeleteResourceRequest request, StompHeaderAccessor headerAccessor);
}
