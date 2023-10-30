package com.portalprojects.entity;

import com.portalprojects.entity.base.PrimaryEntity;
import com.portalprojects.infrastructure.constant.EntityProperties;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import jakarta.persistence.Column;
import org.hibernate.annotations.Index;

/**
 * @author thangncph26123
 */
@Entity
@Getter
@Setter
@ToString
@Table(name = "project_category")
@AllArgsConstructor
@NoArgsConstructor
public class ProjectCategory extends PrimaryEntity {

    @Column(length = EntityProperties.LENGTH_ID)
    private String projectId;

    @Column(length = EntityProperties.LENGTH_ID)
    private String categoryId;
}
