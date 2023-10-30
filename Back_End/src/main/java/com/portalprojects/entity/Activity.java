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
import org.hibernate.annotations.Index;

/**
 * @author thangncph26123
 */

@Entity
@Getter
@Setter
@ToString
@Table(name = "activity")
@AllArgsConstructor
@NoArgsConstructor
public class Activity extends PrimaryEntity {

    @Column(length = EntityProperties.LENGTH_ID)
    private String memberCreatedId;

    @Column(length = EntityProperties.LENGTH_ID)
    private String memberId;

    @Column(length = EntityProperties.LENGTH_ID)
    @Index(name = "idx_todoId")
    private String todoId;

    @Column(length = EntityProperties.LENGTH_ID)
    @Index(name = "idx_todoListId")
    private String todoListId;

    @Column(length = EntityProperties.LENGTH_ID)
    @Index(name = "idx_projectId")
    private String projectId;

    @Column(length = EntityProperties.LENGTH_DESCRIPTION)
    private String contentAction;

    @Column(length = EntityProperties.LENGTH_NAME)
    private String urlImage;

    @Column(length = EntityProperties.LENGTH_ID)
    private String imageId;
}
