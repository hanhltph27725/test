package com.portalprojects.core.member.service.impl;

import com.portalprojects.core.common.base.PageableObject;
import com.portalprojects.core.member.model.request.MeFindNotificationMemberRequest;
import com.portalprojects.core.member.model.response.MeNotificationMemberResponse;
import com.portalprojects.core.member.repository.MeNotificationMemberRepository;
import com.portalprojects.core.member.service.MeNotificationMemberService;
import com.portalprojects.entity.NotificationMember;
import com.portalprojects.infrastructure.constant.Message;
import com.portalprojects.infrastructure.exception.rest.MessageHandlingException;
import lombok.Synchronized;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.Optional;

/**
 * @author thangncph26123
 */
@Service
@Validated
public class MeNotificationMemberServiceImpl implements MeNotificationMemberService {

    @Autowired
    private MeNotificationMemberRepository meNotificationMemberRepository;

    @Override
    public PageableObject<MeNotificationMemberResponse> getAllNotificationMember(final MeFindNotificationMemberRequest request) {
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize());
        Page<MeNotificationMemberResponse> res = meNotificationMemberRepository.getAllNotificationMember(pageable, request);
        return new PageableObject(res);
    }

    @Override
    public Integer countNotificationMember(String memberId) {
        return meNotificationMemberRepository.countNotificationMember(memberId);
    }

    @Override
    @Synchronized
    public String updateStatus(String idNotificationMember) {
        Optional<NotificationMember> notificationMemberFind = meNotificationMemberRepository.findById(idNotificationMember);
        if(!notificationMemberFind.isPresent()){
            throw new MessageHandlingException(Message.ERROR_UNKNOWN);
        }
        notificationMemberFind.get().setStatus(1);
        meNotificationMemberRepository.save(notificationMemberFind.get());
        return idNotificationMember;
    }
}
