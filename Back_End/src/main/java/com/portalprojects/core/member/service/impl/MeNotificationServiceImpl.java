package com.portalprojects.core.member.service.impl;

import com.portalprojects.core.member.model.request.MeCreateNotificationCommentRequest;
import com.portalprojects.core.member.repository.MeNotificationMemberRepository;
import com.portalprojects.core.member.repository.MeNotificationRepository;
import com.portalprojects.core.member.service.MeNotificationService;
import com.portalprojects.entity.Notification;
import com.portalprojects.entity.NotificationMember;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.ArrayList;
import java.util.List;

/**
 * @author thangncph26123
 */
@Service
@Validated
public class MeNotificationServiceImpl implements MeNotificationService {

    @Autowired
    private MeNotificationRepository meNotificationRepository;

    @Autowired
    private MeNotificationMemberRepository meNotificationMemberRepository;

    @Override
    public void createNotification(@Valid MeCreateNotificationCommentRequest request) {
        Notification notification = new Notification();
        notification.setMemberIdCreated(request.getIdUser());
        notification.setUrl(request.getUrl());
        notification.setTodoId(request.getTodoId());
        notification.setContent(request.getUsername() + " đã nhắc đến bạn trong một bình luận");
        Notification newNotification = meNotificationRepository.save(notification);

        List<String> listIdMember = request.getListMemberId();
        List<NotificationMember> newList = new ArrayList<>();
        listIdMember.forEach(xx -> {
            if(!xx.equals(request.getIdUser())){
                NotificationMember notificationMember = new NotificationMember();
                notificationMember.setNotificationId(newNotification.getId());
                notificationMember.setMemberId(xx);
                notificationMember.setStatus(0);
                newList.add(notificationMember);
            }
        });
        meNotificationMemberRepository.saveAll(newList);
    }
}
