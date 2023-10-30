package com.portalprojects.core.stakeholder.model.response;

import com.portalprojects.entity.*;
import com.portalprojects.entity.base.IsIdentified;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;


@Projection(types = {StakeholderProject.class, Stakeholder.class, Project.class, MemberProject.class, Period.class, Todo.class, TodoList.class, Category.class, Label.class})
public interface StStakeholderProjectResponse extends IsIdentified {
    //    stakeholder_project
    Integer getStt();

    @Value("#{target.role}")
    String roleStakeholderProject();

    //stakeholder
    @Value("#{target.username}")
    String getUserNameStakeholder();

    @Value("#{target.name}")
    String getNameStakeholder();

    @Value("#{target.phone_number}")
    String getPhoneStakeholder();

    @Value("#{target.emailFE}")
    String getEmailFe();

    @Value("#{target.emailFPT}")
    String getEmailFpt();

    //    project
    @Value("#{target.name}")
    String getNameProject();

    @Value("#{target.code}")
    String getCodeProject();

    @Value("#{target.descriptions}")
    String getDescriptionsProject();

    @Value("#{target.start_time}")
    Long getStartTimeProject();

    @Value("#{target.end_time}")
    Long getEndTimeProject();

    @Value("#{target.progress}")
    Short getProgressProject();

    @Value("#{target.created_date}")
    Long getCreateDateProject();

    @Value("#{target.status_project}")
    String getStatusProject();

    //    member
    @Value("#{target.role}")
    String getRoleMember();

    @Value("#{target.status_work}")
    String getStatusWorkMember();

    //    period
    @Value("#{target.code}")
    String getCodePeriod();

    @Value("#{target.name}")
    String getNamePeriod();

    @Value("#{target.progress}")
    Short getProgressPeriod();

    @Value("#{target.target}")
    String getTargetPeriod();

    @Value("#{target.start_time}")
    Long getStartTimePeriod();

    @Value("#{target.end_time}")
    Long getEndTimePeriod();

    @Value("#{target.descriptions}")
    String getDescriptionsPeriod();

    @Value("#{target.status_period}")
    Integer getStatusPeriod();

    //    todoList
    @Value("#{target.code}")
    String getCodeTodoList();

    @Value("#{target.name}")
    String getNameTodoList();

    @Value("#{target.index_todo_list}")
    Byte getIndexTodoList();

    //    todos
    @Value("#{target.code}")
    String getCodeTodo();

    @Value("#{target.name}")
    String getNameTodo();

    @Value("#{target.priority_level}")
    String getPriorityLevelTodo();

    @Value("#{target.descriptions}")
    String getDescriptionsTodo();

    @Value("#{target.deadline}")
    Long getDeadlineTodo();

    @Value("#{target.index_todo}")
    Short getIndexTodo();

    @Value("#{target.progress}")
    Short getProgressTodo();

    @Value("#{target.number_todo_complete}")
    Short getNumberTodoCompleteTodo();

    @Value("#{target.number_todo}")
    Short getNumberTodo();

    //    category
    @Value("#{target.code}")
    String getCodeCate();

    @Value("#{target.name}")
    String getNameCate();

    //    label
    @Value("#{target.code}")
    String getCodeLabel();

    @Value("#{target.name}")
    String getNameLabel();

    @Value("#{target.color_label}")
    String getColorLabel();
}


