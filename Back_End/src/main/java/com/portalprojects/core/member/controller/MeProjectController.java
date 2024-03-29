package com.portalprojects.core.member.controller;

import com.portalprojects.core.common.base.ResponseObject;
import com.portalprojects.core.member.model.request.MeFindProjectRequest;
import com.portalprojects.core.member.model.request.MeUpdateBackgroundProjectRequest;
import com.portalprojects.core.member.service.MeProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
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
@RequestMapping("/member/project")
@CrossOrigin("*")
public class MeProjectController {

    @Autowired
    private MeProjectService meProjectService;

    @GetMapping
    public ResponseObject getProjectByIdUser(final MeFindProjectRequest request){
        return new ResponseObject(meProjectService.getAllProjectByIdUser(request, request.getIdUser()));
    }

    @GetMapping("/detail-project/{id}")
    public ResponseObject detailProject(@PathVariable("id") String id){
        System.out.println(id);
        return new ResponseObject(meProjectService.findById(id));
    }

    @MessageMapping("/update-background-project/{projectId}")
    @SendTo("/portal-projects/update-background-project/{projectId}")
    public ResponseObject updateBackGround(@RequestBody MeUpdateBackgroundProjectRequest request,
                                           @DestinationVariable String projectId){
        return new ResponseObject(meProjectService.updateBackground(request));
    }
}
