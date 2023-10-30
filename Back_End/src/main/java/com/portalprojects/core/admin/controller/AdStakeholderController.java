package com.portalprojects.core.admin.controller;

import com.portalprojects.core.admin.model.request.AdCreateStakeholderRequest;
import com.portalprojects.core.admin.model.request.AdFindStakeholderRequest;
import com.portalprojects.core.admin.model.request.AdUpdateStakeholderRequest;
import com.portalprojects.core.admin.service.AdStakeholderService;
import com.portalprojects.core.common.base.ResponseObject;
import com.portalprojects.entity.Stakeholder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/stakeholder")
@CrossOrigin(origins = {"*"}, maxAge = -1)
public class AdStakeholderController {
    @Autowired
    private AdStakeholderService adStakeholderService;

    @GetMapping("page/{page}")
    public ResponseEntity<?> getAll(@PathVariable int page) {
        Pageable pageRequest = PageRequest.of(page - 1, 5);
        List<Stakeholder> list = adStakeholderService.findAllProject(pageRequest);
        return ResponseEntity.ok(list);
    }

    @GetMapping("")
    public ResponseObject viewStakeholder( @ModelAttribute final AdFindStakeholderRequest findStakeholderRequest) {
        return new ResponseObject((adStakeholderService.searchStakeholder(findStakeholderRequest)));
    }

    @GetMapping("/{id}")
    public ResponseObject detailStakeholder(@PathVariable("id") String id) {
        return new ResponseObject(adStakeholderService.findStakeholderById(id));
    }

    @PostMapping("/add")
    public ResponseObject addStakeholder(@RequestBody AdCreateStakeholderRequest createStakeholderRequest) {
        return new ResponseObject(adStakeholderService. createStakeholder(createStakeholderRequest));
    }

    @PutMapping("/update/{id}")
    public ResponseObject updateStakeholder(@PathVariable("id") String id,
                                            @RequestBody AdUpdateStakeholderRequest updateStakeholderRequest) {
        updateStakeholderRequest.setId(id);
        return new ResponseObject(adStakeholderService.updateStakeholder(updateStakeholderRequest));
    }


}
