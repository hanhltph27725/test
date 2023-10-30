package com.portalprojects.core.admin.repository;

import com.portalprojects.core.admin.model.request.AdFindStakeholderRequest;
import com.portalprojects.core.admin.model.response.AdStakeholderResponse;
import com.portalprojects.entity.Stakeholder;
import com.portalprojects.repository.StakeholderRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdStakeholderRepository extends StakeholderRepository {
    @Query(" SELECT  x FROM Stakeholder x")
    List<Stakeholder> getAllStakeholder(Pageable pageable);

    @Query(value = """
             SELECT  x.username                  
             FROM stakeholder x 
             WHERE x.username = :userNameSt AND  :userNameSt IN ( SELECT  x.username FROM stakeholder x WHERE x.id != :id)  
            """, nativeQuery = true)
    String getStakeholderByUserName(@Param("userNameSt") String userNameSt, @Param("id") String id);


    @Query(value = """
             SELECT ROW_NUMBER() OVER(ORDER BY x.last_modified_date DESC ) AS STT ,
                     x.id,
                     x.username,
                     x.name,
                     x.phone_number,
                     x.emailfe,
                     x.emailfpt,
                     x.created_date
             FROM stakeholder x 
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
    Page<AdStakeholderResponse> findByNameStakeholder(@Param("findStakeholderRequest") AdFindStakeholderRequest findStakeholderRequest, Pageable page);

}
