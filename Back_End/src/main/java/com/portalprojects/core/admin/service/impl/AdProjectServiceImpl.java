package com.portalprojects.core.admin.service.impl;

import com.portalprojects.core.admin.model.request.AdCreateProjectRepuest;
import com.portalprojects.core.admin.model.request.AdFindProjectRepuest;
import com.portalprojects.core.admin.model.request.AdUpdateProjectRequest;
import com.portalprojects.core.admin.model.response.AdProjectReponse;
import com.portalprojects.core.admin.repository.AdLabelProjectRepository;
import com.portalprojects.core.admin.repository.AdProjectRepository;
import com.portalprojects.core.admin.service.AdProjectService;
import com.portalprojects.core.common.base.PageableObject;
import com.portalprojects.entity.Label;
import com.portalprojects.entity.LabelProject;
import com.portalprojects.entity.Project;
import com.portalprojects.infrastructure.constant.Message;
import com.portalprojects.infrastructure.exception.rest.RestApiException;
import com.portalprojects.repository.LabelRepository;
import com.portalprojects.util.FormUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * @author NguyenVinh
 */
@Service
public class AdProjectServiceImpl implements AdProjectService {

    @Autowired
    private AdProjectRepository adProjectRepository;

    @Autowired
    @Qualifier(LabelRepository.NAME)
    private LabelRepository labelRepository;

    @Autowired
    private AdLabelProjectRepository adLabelProjectRepository;

    private FormUtils formUtils = new FormUtils();

    private List<AdProjectReponse> listProject;

    @Override
    public List<Project> findAllProject(Pageable pageable) {
        return adProjectRepository.findAllProject(pageable);
    }

    @Override
    public Project createProject(@Valid AdCreateProjectRepuest command) {
        String checkCode = adProjectRepository.getProjectByCode(command.getCode());
        if (checkCode != null) {
            throw new RestApiException(Message.CODE_PROJECT_ALREADY_EXISTS);
        }
        Project project = formUtils.convertToObject(Project.class, command);
        project.setBackgroundColor("#59a1e3");
        Project newProject = adProjectRepository.save(project);
        // lấy ra all label
        List<Label> listLabel = labelRepository.findAll();
        List<LabelProject> newList = new ArrayList<>();
        listLabel.forEach(item -> {
            LabelProject labelProject = new LabelProject();
            labelProject.setProjectId(newProject.getId());
            labelProject.setColorLabel(item.getColorLabel());
            labelProject.setCode(item.getCode());
            labelProject.setName(item.getName());

            newList.add(labelProject);
        });
        adLabelProjectRepository.saveAll(newList);
        return newProject;
    }

    @Override
    public PageableObject<AdProjectReponse> searchProject(final AdFindProjectRepuest rep) {
        Pageable pageable = PageRequest.of(rep.getPage(), rep.getSize());
        Page<AdProjectReponse> reponses = adProjectRepository.findByNameProject(rep, pageable);
        listProject = reponses.stream().toList();
        return new PageableObject<>(reponses);
    }

    // lấy project theo id
    @Override
    public Project findProjectById(String id) {
        Optional<Project> projectCheck = adProjectRepository.findById(id);
        if (!projectCheck.isPresent()) {
            throw new RestApiException(Message.PROJECT_NOT_EXISTS);
        }
        return projectCheck.get();
    }

    @Override
    public Boolean removeProject(String id) {
        Optional<Project> projectCheck = adProjectRepository.findById(id);
        if (!projectCheck.isPresent()) {
            throw new RestApiException(Message.PROJECT_NOT_EXISTS);
        }
        adProjectRepository.delete(projectCheck.get());
        return true;
    }

    @Override
    public Project updateProject(AdUpdateProjectRequest comand) {
        Optional<Project> projectCheck = adProjectRepository.findById(comand.getId());
        if (!projectCheck.isPresent()) {
            throw new RestApiException(Message.PROJECT_NOT_EXISTS);
        }
        String checkCodeProject = adProjectRepository.findByIdCode(comand.getCode(),comand.getId());
        if(checkCodeProject != null){
            throw new RestApiException(Message.CODE_PROJECT_ALREADY_EXISTS);
        }
        Project project = projectCheck.get();
        project.setStatusProject(comand.getStatusProject());
        project.setCode(comand.getCode());
        project.setDescriptions(comand.getDescriptions());
        project.setName(comand.getName());
        project.setProgress((float) comand.getProgress());
        project.setStartTime(comand.getStartTime());
        project.setEndTime(comand.getEndTime());
        return adProjectRepository.save(project);
    }


}
