package com.portalprojects.core.admin.service;

import com.portalprojects.core.admin.model.request.AdCreateProjectRepuest;
import com.portalprojects.core.admin.model.request.AdFindProjectRepuest;
import com.portalprojects.core.admin.model.request.AdUpdateProjectRequest;
import com.portalprojects.core.admin.model.response.AdProjectReponse;
import com.portalprojects.core.common.base.PageableObject;
import com.portalprojects.entity.Project;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * @author NguyenVinh
 */

public interface AdProjectService {

    List<Project> findAllProject(Pageable pageable);

    Project createProject(@Valid final AdCreateProjectRepuest command);

    PageableObject<AdProjectReponse> searchProject(final AdFindProjectRepuest rep);

    Project findProjectById(final String id);

    Boolean removeProject(final String id);

    Project updateProject(final AdUpdateProjectRequest comand);

}
