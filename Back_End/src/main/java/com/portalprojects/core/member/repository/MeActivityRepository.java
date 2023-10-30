package com.portalprojects.core.member.repository;

import com.portalprojects.core.member.model.response.MeActivityResponse;
import com.portalprojects.entity.Activity;
import com.portalprojects.repository.ActivityRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author thangncph26123
 */
@Repository
public interface MeActivityRepository extends ActivityRepository {

    @Query(value = """
            SELECT a.id, a.member_created_id, a.member_id, a.project_id, a.todo_id,
             a.todo_list_id, a.content_action, a.url_image, a.created_date FROM activity a 
            WHERE a.todo_id = :idTodo
            ORDER BY a.created_date DESC 
            """, nativeQuery = true)
    List<MeActivityResponse> getAll(@Param("idTodo") String idTodo);

    @Query(value = """
            SELECT * FROM activity a 
            WHERE a.image_id = :idImage
            """, nativeQuery = true)
    Activity findActivityByIdImage(@Param("idImage") String idImage);
}
