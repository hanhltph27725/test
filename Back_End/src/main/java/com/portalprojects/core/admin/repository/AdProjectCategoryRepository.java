package com.portalprojects.core.admin.repository;


import com.portalprojects.core.admin.model.response.AdProjectCategoryReponse;
import com.portalprojects.repository.ProjectCategoryRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author NguyenVinh
 */
@Repository
public interface AdProjectCategoryRepository extends ProjectCategoryRepository {

    @Query("SELECT a FROM ProjectCategory a WHERE a.projectId = :id")
    List<AdProjectCategoryReponse> getAllByIdProject(@Param("id") String idProject);
}
