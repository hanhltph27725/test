package com.portalprojects.core.admin.repository;

import com.portalprojects.core.admin.model.request.AdFindProjectRepuest;
import com.portalprojects.core.admin.model.response.AdProjectReponse;
import com.portalprojects.entity.Project;
import com.portalprojects.repository.ProjectRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author NguyenVinh
 */

@Repository
public interface AdProjectRepository extends ProjectRepository {

    @Query(" SELECT  pro FROM Project pro")
    List<Project> findAllProject(Pageable pageable);


    @Query(value = """
             SELECT  DISTINCT   pro.id,
                      pro.name,
                      pro.code,
                      pro.descriptions,
                      pro.status_project,
                      pro.start_time,
                      pro.end_time,
                      pro.progress,
                      pro.created_date
              FROM project_category a
              JOIN project pro on a.project_id = pro.id
              JOIN category cate on a.category_id = cate.id
             WHERE  
             ( :#{#rep.name} IS NULL 
                OR :#{#rep.name} LIKE '' 
                OR pro.name LIKE %:#{#rep.name}% )
             AND 
              ( :#{#rep.nameCategory} IS NULL 
                OR :#{#rep.nameCategory} LIKE '' 
                OR cate.name LIKE %:#{#rep.nameCategory}% )
             ORDER BY pro.last_modified_date DESC
            """, countQuery = """
            SELECT COUNT(pro.id) 
            FROM project_category a
            JOIN project pro on a.project_id = pro.id
            JOIN category cate on a.category_id = cate.id
           WHERE  
             ( :#{#rep.name} IS NULL 
                OR :#{#rep.name} LIKE '' 
                OR pro.name LIKE %:#{#rep.name}% )
             AND 
              ( :#{#rep.nameCategory} IS NULL 
                OR :#{#rep.nameCategory} LIKE '' 
                OR cate.name LIKE %:#{#rep.nameCategory}% ) 
            ORDER BY pro.last_modified_date DESC
            """, nativeQuery = true)
    Page<AdProjectReponse> findByNameProject(@Param("rep") AdFindProjectRepuest rep , Pageable page);

    @Query(value = """
             SELECT  pro.code                  
             FROM project pro 
             WHERE 
                  pro.code = :codeProject  
            """, nativeQuery = true)
    String getProjectByCode(@Param("codeProject") String codeProject);


    @Query("SELECT pro.id  FROM Project pro WHERE pro.code = :codeProject AND pro.id <> :id")
    String findByIdCode(@Param("codeProject") String codeProject,
                        @Param("id") String id);
}
