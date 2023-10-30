package com.portalprojects.repository;

import com.portalprojects.entity.Todo;
import com.portalprojects.infrastructure.projection.SimpleEntityProj;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author thangncph26123
 */
@Repository(TodoRepository.NAME)
public interface TodoRepository extends JpaRepository<Todo, String> {

    public static final String NAME = "BaseTodoRepository";

    @Query(value = """
            SELECT id, name FROM todo
            """, nativeQuery = true)
    List<SimpleEntityProj> findAllSimpleEntity();

    @Query(value = """
            SELECT COUNT(1) FROM to_do WHERE todo_list_id = :todoListId AND todo_id IS NULL
            """, nativeQuery = true)
    Integer countSimpleEntityByIdTodo(@Param("todoListId") String todoListId);

    @Query(value = """
            SELECT MAX(a.index_todo) FROM to_do a JOIN period_todo b ON a.id = b.todo_id
            JOIN period c ON c.id = b.period_id
            WHERE a.todo_list_id = :todoListId AND a.todo_id IS NULL
            AND c.id = :idPeriod
            """, nativeQuery = true)
    Short getIndexTodoMax(@Param("todoListId") String todoListId, @Param("idPeriod") String idPeriod);

    @Query(value = """
            SELECT COUNT(1) FROM to_do a 
            JOIN todo_list b ON a.todo_list_id = b.id
            WHERE a.type = 1 AND a.todo_id IS NULL 
            AND b.id = :todoListId AND b.project_id = :projectId
            """, nativeQuery = true)
    Integer countTodoByTodoListAllProject(@Param("projectId") String projectId, @Param("todoListId") String todoListId);

    @Query(value = """
            SELECT COUNT(1) FROM to_do a 
            JOIN todo_list b ON a.todo_list_id = b.id
            WHERE a.type = 1 AND a.todo_id IS NULL 
            AND b.project_id = :projectId 
            AND a.status_todo = :statusTodo
            """, nativeQuery = true)
    Integer countTodoByDueDateAllProject(@Param("projectId") String projectId,
                                         @Param("statusTodo") Integer statusTodo);

    @Query(value = """
            SELECT COUNT(1) FROM to_do a 
            JOIN todo_list b ON a.todo_list_id = b.id
            WHERE a.type = 1 AND a.todo_id IS NULL 
            AND b.project_id = :projectId 
            AND a.deadline IS NULL
            """, nativeQuery = true)
    Integer countTodoByNoDueDateAllProject(@Param("projectId") String projectId);

    @Query(value = """
            SELECT COUNT(1) FROM to_do a 
            JOIN todo_list b ON a.todo_list_id = b.id
            JOIN assign c ON a.id = c.todo_id
            WHERE a.type = 1 AND a.todo_id IS NULL 
            AND b.project_id = :projectId 
            AND c.member_id = :memberId
            """, nativeQuery = true)
    Integer countTodoByMemberAllProject(@Param("projectId") String projectId, @Param("memberId") String memberId);

    @Query(value = """
            SELECT COUNT(1)
            FROM to_do a
            JOIN todo_list b ON a.todo_list_id = b.id
            LEFT JOIN assign c ON a.id = c.todo_id
            WHERE a.type = 1
            AND a.todo_id IS NULL
            AND b.project_id = :projectId 
            AND c.id IS NULL;
            """, nativeQuery = true)
    Integer countTodoByNoMemberAllProject(@Param("projectId") String projectId);

    @Query(value = """
            SELECT COUNT(1) FROM to_do a 
            JOIN todo_list b ON a.todo_list_id = b.id
            JOIN label_project_todo c ON a.id = c.todo_id
            WHERE a.type = 1 AND a.todo_id IS NULL 
            AND b.project_id = :projectId 
            AND c.label_project_id = :labelProjectId
            """, nativeQuery = true)
    Integer countTodoByLabelAllProject(@Param("projectId") String projectId, @Param("labelProjectId") String labelProjectId);

    @Query(value = """
            SELECT COUNT(1)
            FROM to_do a
            JOIN todo_list b ON a.todo_list_id = b.id
            LEFT JOIN label_project_todo c ON a.id = c.todo_id
            WHERE a.type = 1
            AND a.todo_id IS NULL
            AND b.project_id = :projectId 
            AND c.id IS NULL;
            """, nativeQuery = true)
    Integer countTodoByNoLabelAllProject(@Param("projectId") String projectId);

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    @Query(value = """
            SELECT COUNT(1) FROM to_do a 
            JOIN todo_list b ON a.todo_list_id = b.id
            JOIN period_todo c ON a.id = c.todo_id
            WHERE a.type = 1 AND a.todo_id IS NULL 
            AND b.id = :todoListId AND b.project_id = :projectId
            AND c.period_id = :periodId
            """, nativeQuery = true)
    Integer countTodoByTodoListPeriod(@Param("projectId") String projectId,
                                      @Param("periodId") String periodId,
                                      @Param("todoListId") String todoListId);

    @Query(value = """
            SELECT COUNT(1) FROM to_do a 
            JOIN todo_list b ON a.todo_list_id = b.id
            JOIN period_todo c ON a.id = c.todo_id
            WHERE a.type = 1 AND a.todo_id IS NULL 
            AND b.project_id = :projectId 
            AND a.status_todo = :statusTodo
            AND c.period_id = :periodId
            """, nativeQuery = true)
    Integer countTodoByDueDatePeriod(@Param("projectId") String projectId,
                                     @Param("periodId") String periodId,
                                     @Param("statusTodo") Integer statusTodo);

    @Query(value = """
            SELECT COUNT(1) FROM to_do a 
            JOIN todo_list b ON a.todo_list_id = b.id
            JOIN period_todo c ON a.id = c.todo_id
            WHERE a.type = 1 AND a.todo_id IS NULL 
            AND b.project_id = :projectId 
            AND a.deadline IS NULL
            AND c.period_id = :periodId
            """, nativeQuery = true)
    Integer countTodoByNoDueDatePeriod(@Param("projectId") String projectId,
                                       @Param("periodId") String periodId);

    @Query(value = """
            SELECT COUNT(1) FROM to_do a 
            JOIN todo_list b ON a.todo_list_id = b.id
            JOIN assign c ON a.id = c.todo_id
            JOIN period_todo d ON a.id = d.todo_id
            WHERE a.type = 1 AND a.todo_id IS NULL 
            AND b.project_id = :projectId 
            AND c.member_id = :memberId
            AND d.period_id = :periodId
            """, nativeQuery = true)
    Integer countTodoByMemberPeriod(@Param("projectId") String projectId,
                                    @Param("periodId") String periodId,
                                    @Param("memberId") String memberId);

    @Query(value = """
            SELECT COUNT(1)
            FROM to_do a
            JOIN todo_list b ON a.todo_list_id = b.id
            LEFT JOIN assign c ON a.id = c.todo_id
            JOIN period_todo d ON a.id = d.todo_id
            WHERE a.type = 1
            AND a.todo_id IS NULL
            AND b.project_id = :projectId 
            AND c.id IS NULL
            AND d.period_id = :periodId
            """, nativeQuery = true)
    Integer countTodoByNoMemberPeriod(@Param("projectId") String projectId,
                                      @Param("periodId") String periodId);

    @Query(value = """
            SELECT COUNT(1) FROM to_do a 
            JOIN todo_list b ON a.todo_list_id = b.id
            JOIN label_project_todo c ON a.id = c.todo_id
            JOIN period_todo d ON a.id = d.todo_id
            WHERE a.type = 1 AND a.todo_id IS NULL 
            AND b.project_id = :projectId 
            AND c.label_project_id = :labelProjectId
            AND d.period_id = :periodId
            """, nativeQuery = true)
    Integer countTodoByLabelPeriod(@Param("projectId") String projectId,
                                   @Param("periodId") String periodId,
                                   @Param("labelProjectId") String labelProjectId);

    @Query(value = """
            SELECT COUNT(1)
            FROM to_do a
            JOIN todo_list b ON a.todo_list_id = b.id
            LEFT JOIN label_project_todo c ON a.id = c.todo_id
            JOIN period_todo d ON a.id = d.todo_id
            WHERE a.type = 1
            AND a.todo_id IS NULL
            AND b.project_id = :projectId 
            AND c.id IS NULL
            AND d.period_id = :periodId
            """, nativeQuery = true)
    Integer countTodoByNoLabelPeriod(@Param("projectId") String projectId,
                                     @Param("periodId") String periodId);
}
