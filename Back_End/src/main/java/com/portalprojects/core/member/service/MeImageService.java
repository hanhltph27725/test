package com.portalprojects.core.member.service;

import com.portalprojects.core.common.base.TodoObject;
import com.portalprojects.core.member.model.request.MeChangeCoverTodoRequest;
import com.portalprojects.core.member.model.request.MeCreateImageRequest;
import com.portalprojects.core.member.model.request.MeDeleteImageRequest;
import com.portalprojects.core.member.model.request.MeUpdateNameImageRequest;
import com.portalprojects.core.member.model.response.MeImageResponse;
import com.portalprojects.entity.Image;
import jakarta.validation.Valid;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * @author thangncph26123
 */
public interface MeImageService {

    TodoObject add (@Valid MeCreateImageRequest request, StompHeaderAccessor headerAccessor);

    void uploadFile(String idTodo, MultipartFile file);

    Image findById(String id);

    List<MeImageResponse> getAllByIdTodo(String idTodo);

    Image updateNameImage(@Valid MeUpdateNameImageRequest request, StompHeaderAccessor headerAccessor);

    TodoObject deleteImage(@Valid MeDeleteImageRequest request, StompHeaderAccessor headerAccessor);

    TodoObject changeCoverTodo(@Valid MeChangeCoverTodoRequest request, StompHeaderAccessor headerAccessor);
}
