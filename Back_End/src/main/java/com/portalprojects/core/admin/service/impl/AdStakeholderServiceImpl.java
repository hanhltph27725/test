package com.portalprojects.core.admin.service.impl;

import com.portalprojects.core.admin.model.request.AdCreateStakeholderRequest;
import com.portalprojects.core.admin.model.request.AdFindStakeholderRequest;
import com.portalprojects.core.admin.model.request.AdUpdateStakeholderRequest;
import com.portalprojects.core.admin.model.response.AdStakeholderResponse;
import com.portalprojects.core.admin.repository.AdStakeholderRepository;
import com.portalprojects.core.admin.service.AdStakeholderService;
import com.portalprojects.core.common.base.PageableObject;
import com.portalprojects.entity.Stakeholder;
import com.portalprojects.infrastructure.constant.Message;
import com.portalprojects.infrastructure.exception.rest.RestApiException;
import com.portalprojects.util.FormUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdStakeholderServiceImpl implements AdStakeholderService {

    @Autowired
    private AdStakeholderRepository adStakeholderRepository;

    private FormUtils formUtils = new FormUtils();

    private List<AdStakeholderResponse> listStakeholder;

    @Override
    public List<Stakeholder> findAllProject(Pageable pageable) {
        return adStakeholderRepository.getAllStakeholder(pageable);
    }

    @Override
    public Stakeholder createStakeholder(@Valid AdCreateStakeholderRequest createStakeholderRequest) {
        String userNameSt = adStakeholderRepository.getStakeholderByUserName(createStakeholderRequest.getUsername(),createStakeholderRequest.getId());
        if (userNameSt != null) {
            throw new RestApiException(Message.USER_NAME_ALREADY_EXISTS);
        }
        Stakeholder stakeholder = formUtils.convertToObject(Stakeholder.class, createStakeholderRequest);
        return adStakeholderRepository.save(stakeholder);
    }

    @Override
    public PageableObject<AdStakeholderResponse> searchStakeholder(final AdFindStakeholderRequest findStakeholderRequest) {
        Pageable pageable = PageRequest.of(findStakeholderRequest.getPage(), findStakeholderRequest.getSize());
        Page<AdStakeholderResponse> responses = adStakeholderRepository.findByNameStakeholder(findStakeholderRequest, pageable);
        listStakeholder = responses.stream().toList();
        return new PageableObject<>(responses);
    }

    @Override
    public Stakeholder findStakeholderById(String id) {
        Optional<Stakeholder> optional = adStakeholderRepository.findById(id);
        if (!optional.isPresent()) {
            throw new RestApiException(Message.STAKEHOLDER_NOT_EXISTS);
        }
        return optional.get();
    }


    @Override
    public Stakeholder updateStakeholder(AdUpdateStakeholderRequest updateStakeholderRequest) {
        Optional<Stakeholder> optionalCheck = adStakeholderRepository.findById(updateStakeholderRequest.getId());
        if (!optionalCheck.isPresent()) {
            throw new RestApiException(Message.STAKEHOLDER_NOT_EXISTS);
        }
        Stakeholder stakeholder = optionalCheck.get();
        stakeholder.setName(updateStakeholderRequest.getName());
        stakeholder.setUsername(updateStakeholderRequest.getUsername());
        stakeholder.setEmailFE(updateStakeholderRequest.getEmailFE());
        stakeholder.setEmailFPT(updateStakeholderRequest.getEmailFPT());
        stakeholder.setPhoneNumber(updateStakeholderRequest.getPhoneNumber());
        String userNameSt = adStakeholderRepository.getStakeholderByUserName(stakeholder.getUsername(),stakeholder.getId());
        if (userNameSt != null) {
            throw new RestApiException(Message.USER_NAME_ALREADY_EXISTS);
        }
        return adStakeholderRepository.save(stakeholder);
    }


}
