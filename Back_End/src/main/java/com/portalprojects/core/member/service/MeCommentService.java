package com.portalprojects.core.member.service;

import com.portalprojects.core.common.base.PageableObject;
import com.portalprojects.core.member.model.request.MeCreateCommentRequest;
import com.portalprojects.core.member.model.request.MeDeleteCommentRequest;
import com.portalprojects.core.member.model.request.MeFindCommentRequest;
import com.portalprojects.core.member.model.request.MeUpdateCommentRequest;
import com.portalprojects.core.member.model.response.MeCommentResponse;
import com.portalprojects.core.member.model.response.MeDeleteCommentResponse;
import com.portalprojects.entity.Comment;
import jakarta.validation.Valid;

/**
 * @author thangncph26123
 */
public interface MeCommentService {

    Comment add(@Valid MeCreateCommentRequest request);

    PageableObject<MeCommentResponse> getAllCommentByIdTodo(MeFindCommentRequest request);

    Comment update(@Valid MeUpdateCommentRequest request);

    MeDeleteCommentResponse delete(@Valid MeDeleteCommentRequest request);
}
