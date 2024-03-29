package com.portalprojects.core.member.controller;

import com.portalprojects.core.common.base.ResponseObject;
import com.portalprojects.core.member.model.request.DesVarProjectIdAndPeriodIdRequest;
import com.portalprojects.core.member.model.request.MeCreateOrDeleteAssignRequest;
import com.portalprojects.core.member.service.MeAssignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author thangncph26123
 */
@RestController
@RequestMapping("/member/assign")
@CrossOrigin("*")
public class MeAssignController {

    @Autowired
    private MeAssignService meAssignService;

    @GetMapping
    public ResponseObject getMemberByIdTodo(@RequestParam("idTodo") String idTodo) {
        return new ResponseObject(meAssignService.getAllMemberByIdTodo(idTodo));
    }

    @MessageMapping("/create-assign/{projectId}/{periodId}")
    @SendTo("/portal-projects/assign/{projectId}/{periodId}")
    public ResponseObject create(@RequestBody MeCreateOrDeleteAssignRequest request,
                                 @ModelAttribute DesVarProjectIdAndPeriodIdRequest des) {
        return new ResponseObject(meAssignService.create(request));
    }


    @MessageMapping("/delete-assign/{projectId}/{periodId}")
    @SendTo("/portal-projects/assign/{projectId}/{periodId}")
    public ResponseObject delete(@RequestBody MeCreateOrDeleteAssignRequest request,
                                 @ModelAttribute DesVarProjectIdAndPeriodIdRequest des) {
        return new ResponseObject(meAssignService.delete(request));
    }

    @MessageMapping("/join-assign/{projectId}/{periodId}")
    @SendTo("/portal-projects/assign/{projectId}/{periodId}")
    public ResponseObject joinAssign(@RequestBody MeCreateOrDeleteAssignRequest request,
                                 @ModelAttribute DesVarProjectIdAndPeriodIdRequest des) {
        request.setIdMember(request.getIdUser());
        return new ResponseObject(meAssignService.create(request));
    }

    @MessageMapping("/out-assign/{projectId}/{periodId}")
    @SendTo("/portal-projects/assign/{projectId}/{periodId}")
    public ResponseObject outAssign(@RequestBody MeCreateOrDeleteAssignRequest request,
                                   @ModelAttribute DesVarProjectIdAndPeriodIdRequest des) {
        request.setIdMember(request.getIdUser());
        return new ResponseObject(meAssignService.delete(request));
    }
}
