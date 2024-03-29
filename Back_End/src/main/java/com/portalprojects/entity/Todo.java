package com.portalprojects.entity;

import com.portalprojects.entity.base.PrimaryEntity;
import com.portalprojects.infrastructure.constant.EntityProperties;
import com.portalprojects.infrastructure.constant.PriorityLevel;
import com.portalprojects.infrastructure.constant.StatusReminder;
import com.portalprojects.infrastructure.constant.StatusTodo;
import com.portalprojects.infrastructure.constant.TypeTodo;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Index;
import org.hibernate.annotations.Nationalized;

/**
 * @author thangncph26123
 */

@Entity
@Getter
@Setter
@ToString
@Table(name = "to_do")
@AllArgsConstructor
@NoArgsConstructor
public class Todo extends PrimaryEntity {

    @Column(length = EntityProperties.LENGTH_CODE, nullable = false)
    private String code;

    @Column(length = EntityProperties.LENGTH_NAME)
    @Nationalized
    private String name;

    @Column(length = 5000)
    @Nationalized
    private String descriptions;

    private Long deadline;

    private Long reminderTime;

    private StatusReminder statusReminder;

    private Long completionTime;

    private PriorityLevel priorityLevel;

    private Short progress;

    @Column(length = EntityProperties.LENGTH_ID)
    @Index(name = "idx_image")
    private String imageId;

    @Column(length = EntityProperties.LENGTH_NAME)
    private String nameFile;

    @Column
    @Index(name = "idx_index_todo")
    private Short indexTodo;

    @Column(length = EntityProperties.LENGTH_ID)
    @Index(name = "idx_todo_id")
    private String todoId;

    @Column(length = EntityProperties.LENGTH_ID)
    @Index(name = "idx_todo_list_id")
    private String todoListId;

    @Index(name = "idx_status_todo")
    private StatusTodo statusTodo;

    private TypeTodo type;
}
