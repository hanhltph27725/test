package com.portalprojects.core.member.repository;

import com.portalprojects.core.member.model.response.MeMemberProjectResponse;
import com.portalprojects.repository.MemberProjectRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * @author thangncph26123
 */
public interface MeMemberProjectRepository extends MemberProjectRepository {

    @Query(value = """
            SELECT a.id, a.member_id, a.role, a.status_work FROM member_project a WHERE a.project_id = :idProject
            """, nativeQuery = true)
    List<MeMemberProjectResponse> getAllMemberProject(@Param("idProject") String idProject);
}
