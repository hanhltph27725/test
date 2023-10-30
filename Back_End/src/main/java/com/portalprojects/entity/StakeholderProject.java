package com.portalprojects.entity;

import com.portalprojects.entity.base.PrimaryEntity;
import com.portalprojects.infrastructure.constant.EntityProperties;
import com.portalprojects.infrastructure.constant.RoleStakeholderProject;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Index;

/**
 * @author thangncph26123
 */

@Entity
@Getter
@Setter
@ToString
@Table(name = "stakeholder_project")
@AllArgsConstructor
@NoArgsConstructor
public class StakeholderProject extends PrimaryEntity {

    @Column(length = EntityProperties.LENGTH_ID)
    private String stakeholderId;

    @Column(length = EntityProperties.LENGTH_ID)
    private String projectId;

    @Column(nullable = false)
    private RoleStakeholderProject role;
}
