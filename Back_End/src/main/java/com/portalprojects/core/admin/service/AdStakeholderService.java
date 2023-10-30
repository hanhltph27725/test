package com.portalprojects.core.admin.service;

import com.portalprojects.core.admin.model.request.AdCreateStakeholderRequest;
import com.portalprojects.core.admin.model.request.AdFindStakeholderRequest;
import com.portalprojects.core.admin.model.request.AdUpdateStakeholderRequest;
import com.portalprojects.core.admin.model.response.AdStakeholderResponse;
import com.portalprojects.core.common.base.PageableObject;
import com.portalprojects.entity.Stakeholder;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;

import java.util.List;


public interface AdStakeholderService {

    List<Stakeholder> findAllProject(Pageable pageable);

    Stakeholder createStakeholder(@Valid final AdCreateStakeholderRequest createStakeholderRequest);

    PageableObject<AdStakeholderResponse> searchStakeholder(final AdFindStakeholderRequest findStakeholderRequest);

    Stakeholder findStakeholderById(final String id);

    Stakeholder updateStakeholder(final AdUpdateStakeholderRequest updateStakeholderRequest);

}
