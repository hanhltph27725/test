package com.portalprojects.entity;

import com.portalprojects.entity.base.PrimaryEntity;
import com.portalprojects.infrastructure.constant.EntityProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Nationalized;

/**
 * @author thangncph26123
 */

@Entity
@Getter
@Setter
@ToString
@Table(name = "category")
@AllArgsConstructor
@NoArgsConstructor
public class Category extends PrimaryEntity {

    @Column(length = EntityProperties.LENGTH_CODE, nullable = false)
    private String code;

    @Column(length = EntityProperties.LENGTH_NAME_SHORT)
    @Nationalized
    private String name;
}
