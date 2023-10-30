package com.portalprojects.core.stakeholder.repository;

import com.portalprojects.core.admin.model.request.AdFindStakeholderRequest;
import com.portalprojects.core.admin.model.response.AdStakeholderResponse;
import com.portalprojects.core.stakeholder.model.request.StFindByNameAndCategoryProjectRequest;
import com.portalprojects.core.stakeholder.model.response.StStakeholderProjectResponse;
import com.portalprojects.entity.Project;
import com.portalprojects.entity.StakeholderProject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface StStakeholderProjectRepository {

    @Query(" SELECT x FROM StakeholderProject x")
    List<StakeholderProject> pageProject(Pageable pageable);

    @Query(value = """
             SELECT  x.username                  
             FROM Project x 
             WHERE x.username = :userNameSt AND  :userNameSt IN ( SELECT  x.username FROM Project x WHERE x.id != :id)  
            """, nativeQuery = true)
    String getStakeholderByUserName(@Param("userNameSt") String userNameSt, @Param("id") String id);


    @Query(value = """
             SELECT ROW_NUMBER() OVER(ORDER BY p.last_modified_date DESC ) AS STT ,
                     sp.role,
                     s.username,
                     s.name,
                     s.phone_number,
                     s.emailfe,
                     s.emailfpt,
                     p.name,
                     p.code,
                     p.descriptions,
                     p.status_project,
                     p.start_time,
                     p.end_time,
                     p.progress,
                     p.created_date,
                     p.last_modified_date
                     m.role,
                     m.status_work,
                     pr.code,
                     pr.name,
                     pr.target,
                     pr.start_time,
                     pr.end_time,
                     pr.descriptions,
                     pr.status_period,
                     tl.code,
                     tl.name,
                     tl.index_todo_list,
                     t.code,
                     t.name,
                     t.priority_level,
                     t.descriptions,
                     
                     
             FROM stakeholder_project sp 
             WHERE  
             ( :#{#findStakeholderRequest.name} IS NULL 
                OR :#{#findStakeholderRequest.name} LIKE '' 
                OR x.name LIKE %:#{#findStakeholderRequest.name}% ) 
                AND ( :#{#findStakeholderRequest.userName} IS NULL 
                OR :#{#findStakeholderRequest.userName} LIKE '' 
                OR x.username LIKE %:#{#findStakeholderRequest.userName}% )          
            """, countQuery = """
            SELECT COUNT(x.id) FROM stakeholder x
            WHERE 
             ( :#{#findStakeholderRequest.name} IS NULL 
                OR :#{#findStakeholderRequest.name} LIKE '' 
                OR x.name LIKE %:#{#findStakeholderRequest.name}% ) 
                AND ( :#{#findStakeholderRequest.userName} IS NULL 
                OR :#{#findStakeholderRequest.userName} LIKE '' 
                OR x.username LIKE %:#{#findStakeholderRequest.userName}% ) 
            ORDER BY x.last_modified_date DESC
            """, nativeQuery = true)
    Page<StStakeholderProjectResponse> getAll(@Param("stFindByNameAndCategoryProjectRequest") StFindByNameAndCategoryProjectRequest stFindByNameAndCategoryProjectRequest, Pageable page);

}
