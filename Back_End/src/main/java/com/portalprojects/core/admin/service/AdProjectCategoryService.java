package com.portalprojects.core.admin.service;

import com.portalprojects.core.admin.model.request.AdCreateProjectCategoryRequest;
import com.portalprojects.core.admin.model.request.AdUpdateProjectCategoryRequest;
import com.portalprojects.core.admin.model.response.AdProjectCategoryReponse;
import com.portalprojects.entity.ProjectCategory;
import jakarta.validation.Valid;

import java.util.List;

/**
 * @author NguyenVinh
 */
public interface AdProjectCategoryService {

    ProjectCategory creatProjectCategory(@Valid final AdCreateProjectCategoryRequest command);

    List<ProjectCategory> addListProjectCategory(@Valid final List<AdCreateProjectCategoryRequest> list);

    List<ProjectCategory> updateListProjectCategory(String idProject,@Valid final List<AdUpdateProjectCategoryRequest> list);

    List<AdProjectCategoryReponse> getAllByidProject(final String idProject);

    ProjectCategory upadteProjectCategory(@Valid final AdUpdateProjectCategoryRequest command);
}
