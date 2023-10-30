package com.portalprojects.core.member.service.impl;

import com.portalprojects.core.member.model.request.MeCreateMemberProjectRequest;
import com.portalprojects.core.member.model.request.MeUpdateMemberProjectRequest;
import com.portalprojects.core.member.model.response.MeMemberProjectResponse;
import com.portalprojects.core.member.repository.MeMemberProjectRepository;
import com.portalprojects.core.member.service.MeMemberProjectService;
import com.portalprojects.entity.MemberProject;
import com.portalprojects.infrastructure.constant.Message;
import com.portalprojects.infrastructure.constant.RoleMemberProject;
import com.portalprojects.infrastructure.constant.StatusWork;
import com.portalprojects.infrastructure.exception.rest.MessageHandlingException;
import com.portalprojects.infrastructure.successnotification.ConstantMessageSuccess;
import com.portalprojects.infrastructure.successnotification.SuccessNotificationSender;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.Synchronized;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
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
public class MeMemberProjectServiceImpl implements MeMemberProjectService {

    @Autowired
    private MeMemberProjectRepository meMemberProjectRepository;

    @Autowired
    private SuccessNotificationSender successNotificationSender;

    @Override
    @Cacheable(value = "membersByProject", key = "#idProject")
    public List<MeMemberProjectResponse> getAllMemberProject(String idProject) {
        return meMemberProjectRepository.getAllMemberProject(idProject);
    }

    @Override
    @Transactional
    @Synchronized
    @CacheEvict(value = {"membersByProject"}, allEntries = true)
    public MemberProject update(@Valid MeUpdateMemberProjectRequest request, StompHeaderAccessor headerAccessor) {
        Optional<MemberProject> memberProject = meMemberProjectRepository.findById(request.getIdMemberProject());
        if(!memberProject.isPresent()){
            throw new MessageHandlingException(Message.MEMBER_PROJECT_NOT_EXISTS);
        }
        memberProject.get().setRole(RoleMemberProject.values()[request.getRole()]);
        memberProject.get().setStatusWork(StatusWork.values()[request.getStatusWork()]);
        successNotificationSender.senderNotification(ConstantMessageSuccess.CAP_NHAT_THANH_CONG, headerAccessor);
        return meMemberProjectRepository.save(memberProject.get());
    }

    @Override
    @Synchronized
    @CacheEvict(value = {"membersByProject"}, allEntries = true)
    public MemberProject create(@Valid MeCreateMemberProjectRequest request, StompHeaderAccessor headerAccessor) {
        MemberProject memberProject = new MemberProject();
        memberProject.setMemberId(request.getMemberId());
        memberProject.setProjectId(request.getProjectId());
        memberProject.setStatusWork(StatusWork.DANG_LAM);
        memberProject.setRole(RoleMemberProject.values()[request.getRole()]);
        successNotificationSender.senderNotification(ConstantMessageSuccess.THEM_THANH_CONG, headerAccessor);
        return meMemberProjectRepository.save(memberProject);
    }
}
