package com.portalprojects.core.admin.service.impl;

import com.portalprojects.core.admin.model.request.AdBaseCategoryRequest;
import com.portalprojects.core.admin.model.request.AdFindCategoryRequest;
import com.portalprojects.core.admin.model.request.AdUpdateCategoryRequest;
import com.portalprojects.core.admin.model.response.AdCategoryPesponse;
import com.portalprojects.core.admin.repository.AdCategoryRepository;
import com.portalprojects.core.admin.service.AdCategoryService;
import com.portalprojects.core.common.base.PageableObject;
import com.portalprojects.entity.Category;
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
public class AdCategoryServiceImpl implements AdCategoryService {

    @Autowired
    private AdCategoryRepository adCategoryRepository;

    private FormUtils formUtils = new FormUtils();

    private List<AdCategoryPesponse> adCategoryPesponseList;

    @Override
    public List<Category> getAllCategory(Pageable pageable) {
        return adCategoryRepository.getAllCategory(pageable);
    }

    @Override
    public List<Category> findAll() {
        return adCategoryRepository.findAll();
    }

    @Override
    public Category addCategory(@Valid AdBaseCategoryRequest adBaseCategoryRequest) {
        String cateCode = adCategoryRepository.findCateByCode(adBaseCategoryRequest.getCode());
        if (cateCode != null) {
            throw new RestApiException(Message.CODE_CATEGORY_ALREADY_EXISTS);
        }
        Category category = formUtils.convertToObject(Category.class, adBaseCategoryRequest);
        return adCategoryRepository.save(category);
    }

    @Override
    public Category updateCategory(AdUpdateCategoryRequest adUpdateCategoryRequest) {
        Optional<Category> findCategoryById = adCategoryRepository.findById(adUpdateCategoryRequest.getId());
        if (!findCategoryById.isPresent()) {
            throw new RestApiException(Message.CATEGORY_NOT_EXISTS);
        }
        Category category = findCategoryById.get();
        category.setCode(adUpdateCategoryRequest.getCode());
        category.setName(adUpdateCategoryRequest.getName());
        return adCategoryRepository.save(category);
    }

    @Override
    public PageableObject<AdCategoryPesponse> searchCategory(final AdFindCategoryRequest adFindCategoryRequest) {
        Pageable pageable = PageRequest.of(adFindCategoryRequest.getPage(), adFindCategoryRequest.getSize());
        Page<AdCategoryPesponse> adCategoryPesponses = adCategoryRepository.searchCategory(adFindCategoryRequest, pageable);
        adCategoryPesponseList = adCategoryPesponses.stream().toList();
        return new PageableObject<>(adCategoryPesponses);
    }

    @Override
    public Category findCategoryById(String id) {
        Optional<Category> findCategory = adCategoryRepository.findById(id);
        if (!findCategory.isPresent()) {
            throw new RestApiException(Message.CATEGORY_NOT_EXISTS);
        }
        return findCategory.get();
    }

    @Override
    public List<Category> getAllByIdCate() {
        return adCategoryRepository.getAllByIdCate();
    }
}
