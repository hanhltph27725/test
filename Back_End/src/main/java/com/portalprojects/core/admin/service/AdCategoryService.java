package com.portalprojects.core.admin.service;

import com.portalprojects.core.admin.model.request.AdBaseCategoryRequest;
import com.portalprojects.core.admin.model.request.AdFindCategoryRequest;
import com.portalprojects.core.admin.model.request.AdUpdateCategoryRequest;
import com.portalprojects.core.admin.model.response.AdCategoryPesponse;
import com.portalprojects.core.common.base.PageableObject;
import com.portalprojects.entity.Category;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AdCategoryService {

    List<Category> getAllCategory(Pageable pageable);

    List<Category> findAll();

    Category addCategory(@Valid final AdBaseCategoryRequest adCreateCategoryRequest);

    Category updateCategory(final AdUpdateCategoryRequest adUpdateCategoryRequest);

    PageableObject<AdCategoryPesponse> searchCategory(final AdFindCategoryRequest adFindCategoryRequest);

    Category findCategoryById(final String id);

    List<Category> getAllByIdCate();

}
