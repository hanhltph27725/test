package com.portalprojects.entity;

import com.portalprojects.entity.base.PrimaryEntity;
import com.portalprojects.infrastructure.constant.EntityProperties;
import com.portalprojects.infrastructure.constant.RoleMemberProject;
import com.portalprojects.infrastructure.constant.StatusWork;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * @author thangncph26123
 */

@Entity
@Getter
@Setter
@ToString
@Table(name = "member_project")
@AllArgsConstructor
@NoArgsConstructor
public class MemberProject extends PrimaryEntity {

    @Column(length = EntityProperties.LENGTH_ID)
    private String memberId;

    @Column(length = EntityProperties.LENGTH_ID)
    private String projectId;

    @Column(nullable = false)
    private RoleMemberProject role;

    @Column(nullable = false)
    private StatusWork statusWork;
}
