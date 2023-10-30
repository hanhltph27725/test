package com.portalprojects.core.admin.model.response;

import com.portalprojects.entity.ProjectCategory;
import com.portalprojects.entity.base.IsIdentified;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

/**
 * @author NguyenVinh
 */
@Projection(types = {ProjectCategory.class})
public interface AdProjectCategoryReponse extends IsIdentified {

    @Value("#{target.projectId}")
    String getIdProject();

    @Value("#{target.categoryId}")
    String getIdCategory();
}
