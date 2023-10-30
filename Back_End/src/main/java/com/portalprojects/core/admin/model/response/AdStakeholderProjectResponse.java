package com.portalprojects.core.admin.model.response;

import com.portalprojects.entity.Project;
import com.portalprojects.entity.Stakeholder;
import com.portalprojects.entity.StakeholderProject;
import com.portalprojects.entity.base.IsIdentified;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

@Projection(types = {StakeholderProject.class, Project.class})
public interface AdStakeholderProjectResponse extends IsIdentified {

    Integer getStt();

    @Value("#{target.project_id}")
    String getProjectId();

    @Value("#{target.stakeholder_id}")
    String getStakeholderId();

    @Value("#{target.role}")
    String getRole();

    @Value("#{target.name}")
    String getNameProject();

    @Value("#{target.code}")
    String getMaProject();

    @Value("#{target.status_project}")
    String getStatusProject();

}
