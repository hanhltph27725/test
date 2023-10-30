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
@Table(name = "stakeholder")
@AllArgsConstructor
@NoArgsConstructor
public class Stakeholder extends PrimaryEntity {

    @Column(length = EntityProperties.LENGTH_ACCOUNT, nullable = false)
    @Nationalized
    private String username;

    @Column(length = EntityProperties.LENGTH_NAME)
    @Nationalized
    private String name;

    @Column(length = EntityProperties.LENGTH_PHONE)
    private String phoneNumber;

    @Column(length = EntityProperties.LENGTH_EMAIL)
    private String emailFE;

    @Column(length = EntityProperties.LENGTH_EMAIL)
    private String emailFPT;

}
