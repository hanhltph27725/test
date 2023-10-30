package com.portalprojects.core.member.controller;

import com.portalprojects.core.common.base.ResponseObject;
import com.portalprojects.core.member.service.MeActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author thangncph26123
 */
@RestController
@RequestMapping("/member/activity")
@CrossOrigin("*")
public class MeActivityController {

    @Autowired
    private MeActivityService meActivityService;

    @GetMapping("/{id}")
    public ResponseObject getAll(@PathVariable("id") String id){
        return new ResponseObject(meActivityService.getAll(id));
    }
}
