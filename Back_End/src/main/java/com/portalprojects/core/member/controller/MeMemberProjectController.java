package com.portalprojects.core.member.controller;

import com.portalprojects.core.common.base.ResponseObject;
import com.portalprojects.core.member.model.request.MeCreateMemberProjectRequest;
import com.portalprojects.core.member.model.request.MeUpdateMemberProjectRequest;
import com.portalprojects.core.member.service.MeMemberProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author thangncph26123
 */
@RestController
@RequestMapping("/member/member-project")
@CrossOrigin("*")
public class MeMemberProjectController {

    @Autowired
    private MeMemberProjectService meMemberProjectService;

    @GetMapping("/{id}")
    public ResponseObject getAllMemberProject(@PathVariable("id") String id) {
        return new ResponseObject(meMemberProjectService.getAllMemberProject(id));
    }

    @MessageMapping("/update-member-project/{projectId}")
    @SendTo("/portal-projects/update-member-project/{projectId}")
    public ResponseObject update(@RequestBody MeUpdateMemberProjectRequest request,
                                 @DestinationVariable String projectId,
                                 StompHeaderAccessor headerAccessor) {
        return new ResponseObject(meMemberProjectService.update(request, headerAccessor));
    }

    @MessageMapping("/create-member-project/{projectId}")
    @SendTo("/portal-projects/create-member-project/{projectId}")
    public ResponseObject create(@RequestBody MeCreateMemberProjectRequest request,
                                 @DestinationVariable String projectId,
                                 StompHeaderAccessor headerAccessor) {
        return new ResponseObject(meMemberProjectService.create(request, headerAccessor));
    }

}
