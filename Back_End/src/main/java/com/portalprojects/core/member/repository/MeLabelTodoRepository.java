package com.portalprojects.core.member.repository;

import com.portalprojects.repository.LabelProjectTodoRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * @author thangncph26123
 */
public interface MeLabelTodoRepository extends LabelProjectTodoRepository {

    @Modifying
    @Transactional
    @Query(value = """
            DELETE FROM label_project_todo a
            WHERE a.label_project_id = :idlabel AND a.todo_id = :idTodo
            """, nativeQuery = true)
    void delete(@Param("idlabel") String idlabel, @Param("idTodo") String idTodo);
}
