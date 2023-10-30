package com.portalprojects.core.admin.service;

import com.portalprojects.core.admin.model.request.AdCrearteLabelProjectRequest;
import com.portalprojects.entity.LabelProject;

import java.util.List;

/**
 * @author NguyenVinh
 */
public interface AdLabelProjectService {

    List<LabelProject> addAllLabelProject (final List<AdCrearteLabelProjectRequest> command);

}
