package com.portalprojects.repository;

import com.portalprojects.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author thangncph26123
 */
@Repository(CommentRepository.NAME)
public interface CommentRepository extends JpaRepository<Comment, String> {

    public static final String NAME = "BaseCommentRepository";
}
