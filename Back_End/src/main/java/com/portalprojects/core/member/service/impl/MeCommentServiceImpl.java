package com.portalprojects.core.member.service.impl;

import com.portalprojects.core.common.base.PageableObject;
import com.portalprojects.core.member.model.request.MeCreateCommentRequest;
import com.portalprojects.core.member.model.request.MeDeleteCommentRequest;
import com.portalprojects.core.member.model.request.MeFindCommentRequest;
import com.portalprojects.core.member.model.request.MeUpdateCommentRequest;
import com.portalprojects.core.member.model.response.MeCommentResponse;
import com.portalprojects.core.member.model.response.MeDeleteCommentResponse;
import com.portalprojects.core.member.repository.MeCommentRepository;
import com.portalprojects.core.member.service.MeCommentService;
import com.portalprojects.entity.Comment;
import com.portalprojects.infrastructure.constant.Message;
import com.portalprojects.infrastructure.exception.rest.MessageHandlingException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.Synchronized;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.Optional;

/**
 * @author thangncph26123
 */
@Service
@Validated
public class MeCommentServiceImpl implements MeCommentService {

    @Autowired
    private MeCommentRepository meCommentRepository;

    @Override
    @Synchronized
    public Comment add(@Valid MeCreateCommentRequest request) {
        Comment comment = new Comment();
        comment.setMemberId(request.getIdUser());
        comment.setTodoId(request.getIdTodo());
        comment.setContent(request.getContent());
        comment.setStatusEdit(0);
        return meCommentRepository.save(comment);
    }

    @Override
    public PageableObject<MeCommentResponse> getAllCommentByIdTodo(final MeFindCommentRequest request) {
        Pageable pageable = PageRequest.of(request.getPage(), 5);
        Page<MeCommentResponse> res = meCommentRepository.getAllCommentByIdTodo(pageable, request);
        return new PageableObject(res);
    }

    @Override
    @Synchronized
    @Transactional
    public Comment update(@Valid MeUpdateCommentRequest request) {
        Optional<Comment> commentFind = meCommentRepository.findById(request.getId());
        if(!commentFind.isPresent()){
            throw new MessageHandlingException(Message.COMMENT_NOT_EXISTS);
        }
        commentFind.get().setContent(request.getContent());
        commentFind.get().setStatusEdit(1);
        return meCommentRepository.save(commentFind.get());
    }

    @Override
    @Synchronized
    @Transactional
    public MeDeleteCommentResponse delete(MeDeleteCommentRequest request) {
        Optional<Comment> commentFind = meCommentRepository.findById(request.getId());
        if(!commentFind.isPresent()){
            throw new MessageHandlingException(Message.COMMENT_NOT_EXISTS);
        }
        String todoId = commentFind.get().getTodoId();
        meCommentRepository.delete(commentFind.get());
        return new MeDeleteCommentResponse(request.getId(), todoId);
    }

}
