package com.portalprojects.core.member.service.impl;

import com.portalprojects.core.common.base.PageableObject;
import com.portalprojects.core.member.model.request.MeFindProjectRequest;
import com.portalprojects.core.member.model.request.MeUpdateBackgroundProjectRequest;
import com.portalprojects.core.member.model.response.MeProjectResponse;
import com.portalprojects.core.member.repository.MeProjectRepository;
import com.portalprojects.core.member.service.MeProjectService;
import com.portalprojects.entity.Project;
import com.portalprojects.infrastructure.constant.Message;
import com.portalprojects.infrastructure.exception.rest.MessageHandlingException;
import com.portalprojects.infrastructure.exception.rest.RestApiException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.Synchronized;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.Objects;
import java.util.Optional;

/**
 * @author thangncph26123
 */
@Service
@Validated
public class MeProjectServiceImpl implements MeProjectService {

    @Autowired
    private MeProjectRepository meProjectRepository;

    @Override
    public PageableObject<MeProjectResponse> getAllProjectByIdUser(final MeFindProjectRequest request, String idUser) {
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize());
        Page<MeProjectResponse> res = meProjectRepository.getAllProjectById(pageable, idUser);
        return new PageableObject(res);
    }

    @Override
    public Project findById(String id) {
        Optional<Project> project = meProjectRepository.findById(id);
        if (Objects.isNull(project)) {
            throw new RestApiException(Message.PROJECT_NOT_EXISTS);
        }
        return project.get();
    }

    @Override
    @Synchronized
    @Transactional
    public Project updateBackground(@Valid MeUpdateBackgroundProjectRequest request) {
        Optional<Project> projectFind = meProjectRepository.findById(request.getProjectId());
        if (!projectFind.isPresent()) {
            throw new MessageHandlingException(Message.PROJECT_NOT_EXISTS);
        }
        if (request.getType().equals("0")) {
            projectFind.get().setBackgroundImage(request.getName());
            projectFind.get().setBackgroundColor(null);
        } else {
            projectFind.get().setBackgroundImage(null);
            projectFind.get().setBackgroundColor(request.getName());
        }
        return meProjectRepository.save(projectFind.get());
    }
}
