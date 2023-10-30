package com.portalprojects.core.member.service;

import com.portalprojects.core.member.model.request.MeCreateMemberProjectRequest;
import com.portalprojects.core.member.model.request.MeUpdateMemberProjectRequest;
import com.portalprojects.core.member.model.response.MeMemberProjectResponse;
import com.portalprojects.entity.MemberProject;
import jakarta.validation.Valid;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;

import java.util.List;

/**
 * @author thangncph26123
 */
public interface MeMemberProjectService {

    List<MeMemberProjectResponse> getAllMemberProject(String idProject);

    MemberProject update(@Valid MeUpdateMemberProjectRequest request, StompHeaderAccessor headerAccessor);

    MemberProject create(@Valid MeCreateMemberProjectRequest request, StompHeaderAccessor headerAccessor);
}
