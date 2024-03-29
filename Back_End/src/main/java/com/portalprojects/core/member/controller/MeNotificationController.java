package com.portalprojects.core.member.controller;

import com.portalprojects.core.common.base.ResponseObject;
import com.portalprojects.core.member.model.request.MeCreateNotificationCommentRequest;
import com.portalprojects.core.member.service.MeNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author thangncph26123
 */
@RestController
@RequestMapping("/member/notification")
@CrossOrigin("*")
public class MeNotificationController {

    @Autowired
    private MeNotificationService meNotificationService;

    @PostMapping
    public ResponseObject createNotification(@RequestBody MeCreateNotificationCommentRequest request) {
        meNotificationService.createNotification(request);
        return new ResponseObject(true);
    }

    @MessageMapping("/create-notification/{memberId}")
    @SendTo("/portal-projects/create-notification/{memberId}")
    public ResponseObject sendNotification(@DestinationVariable String memberId) {
        return new ResponseObject(true);
    }

}
