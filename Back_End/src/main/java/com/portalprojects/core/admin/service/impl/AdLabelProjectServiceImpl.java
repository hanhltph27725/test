package com.portalprojects.core.admin.service.impl;

import com.portalprojects.core.admin.model.request.AdCrearteLabelProjectRequest;
import com.portalprojects.core.admin.service.AdLabelProjectService;
import com.portalprojects.entity.LabelProject;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author NguyenVinh
 */
@Service
public class AdLabelProjectServiceImpl implements AdLabelProjectService {

    @Override
    public List<LabelProject> addAllLabelProject(List<AdCrearteLabelProjectRequest> command) {
        return null;
    }
}
