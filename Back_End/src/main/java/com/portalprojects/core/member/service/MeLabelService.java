package com.portalprojects.core.member.service;

import com.portalprojects.core.member.model.request.MeCreateLabelProjectRequest;
import com.portalprojects.core.member.model.request.MeDeleteLabelProjectRequest;
import com.portalprojects.core.member.model.request.MeUpdateLabelProjectRequest;
import com.portalprojects.core.member.model.response.MeLabelResponse;
import com.portalprojects.entity.LabelProject;
import jakarta.validation.Valid;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;

import java.util.List;

/**
 * @author thangncph26123
 */
public interface MeLabelService {

    List<MeLabelResponse> getAllLabelByIdTodo(String idTodo);

    List<MeLabelResponse> getAll(String idProject);

    LabelProject create(@Valid MeCreateLabelProjectRequest request, StompHeaderAccessor headerAccessor);

    LabelProject update(@Valid MeUpdateLabelProjectRequest request, StompHeaderAccessor headerAccessor);

    String delete(@Valid MeDeleteLabelProjectRequest request, StompHeaderAccessor headerAccessor);

    LabelProject detail(String id);

}
