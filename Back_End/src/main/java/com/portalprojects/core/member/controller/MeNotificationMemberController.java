package com.portalprojects.core.member.controller;

import com.portalprojects.core.common.base.ResponseObject;
import com.portalprojects.core.member.model.request.MeFindNotificationMemberRequest;
import com.portalprojects.core.member.service.MeNotificationMemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author thangncph26123
 */
@RestController
@RequestMapping("/member/notification-member")
@CrossOrigin("*")
public class MeNotificationMemberController {

    @Autowired
    private MeNotificationMemberService meNotificationMemberService;

    @GetMapping()
    public ResponseObject getAllNotificationMember(final MeFindNotificationMemberRequest request) {
        return new ResponseObject(meNotificationMemberService.getAllNotificationMember(request));
    }

    @GetMapping("/count")
    public ResponseObject countNotificationMember(@RequestParam("memberId") String memberId) {
        return new ResponseObject(meNotificationMemberService.countNotificationMember(memberId));
    }

    @PutMapping("/update-status")
    public ResponseObject updateStatus(@RequestParam("idNotificationMember") String idNotificationMember) {
        return new ResponseObject(meNotificationMemberService.updateStatus(idNotificationMember));
    }
}
