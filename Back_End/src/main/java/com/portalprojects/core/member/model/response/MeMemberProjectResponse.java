package com.portalprojects.core.member.model.response;

import com.portalprojects.entity.MemberProject;
import com.portalprojects.entity.base.IsIdentified;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

/**
 * @author thangncph26123
 */
@Projection(types = {MemberProject.class})
public interface MeMemberProjectResponse extends IsIdentified {

    @Value("#{target.member_id}")
    String getMemberId();

    @Value("#{target.role}")
    String getRole();

    @Value("#{target.status_work}")
    String getStatusWork();
}
