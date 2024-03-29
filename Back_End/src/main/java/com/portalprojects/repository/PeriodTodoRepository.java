package com.portalprojects.repository;

import com.portalprojects.entity.PeriodTodo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author thangncph26123
 */
@Repository(PeriodTodoRepository.NAME)
public interface PeriodTodoRepository extends JpaRepository<PeriodTodo, String> {

    public static final String NAME = "BasePeriodProjectRepository";
}
