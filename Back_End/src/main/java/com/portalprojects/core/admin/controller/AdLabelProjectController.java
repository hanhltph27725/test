package com.portalprojects.core.admin.controller;

import com.portalprojects.core.admin.model.request.AdCrearteLabelProjectRequest;
import com.portalprojects.core.admin.service.AdLabelProjectService;
import com.portalprojects.core.common.base.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @author NguyenVinh
 */
@RestController
@RequestMapping("/admin/label-project")
@CrossOrigin(origins = {"*"})
public class AdLabelProjectController {

}
