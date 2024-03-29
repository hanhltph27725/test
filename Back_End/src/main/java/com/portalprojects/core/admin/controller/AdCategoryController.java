package com.portalprojects.core.admin.controller;

import com.portalprojects.core.admin.model.request.AdBaseCategoryRequest;
import com.portalprojects.core.admin.model.request.AdFindCategoryRequest;
import com.portalprojects.core.admin.model.request.AdUpdateCategoryRequest;
import com.portalprojects.core.admin.model.response.AdCategoryPesponse;
import com.portalprojects.core.admin.service.AdCategoryService;
import com.portalprojects.core.common.base.PageableObject;
import com.portalprojects.core.common.base.ResponseObject;
import com.portalprojects.entity.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/category")
@CrossOrigin(origins = {"*"}, maxAge = -1)
public class AdCategoryController {

    @Autowired
    private AdCategoryService adCategoryService;

    @GetMapping("/page/{page}")
    public ResponseEntity<?> getAllCategory(@PathVariable int page) {
        Pageable pageResquest = PageRequest.of(page - 1, 5);
        List<Category> categoryList = adCategoryService.getAllCategory(pageResquest);
        return ResponseEntity.ok(categoryList);
    }

    @GetMapping("/list")
    public ResponseObject findAll() {
        return new ResponseObject(adCategoryService.findAll());
    }

    @GetMapping("")
    public ResponseObject viewCategory(final AdFindCategoryRequest repuest) {
        return new ResponseObject((adCategoryService.searchCategory(repuest)));
    }

    @PostMapping("/add")
    public ResponseObject addCategory(@RequestBody AdBaseCategoryRequest adBaseCategoryRequest) {
        return new ResponseObject(adCategoryService.addCategory(adBaseCategoryRequest));
    }

    @PutMapping("/{id}")
    public ResponseObject updateCategory(@PathVariable("id") String id,@RequestBody AdUpdateCategoryRequest adUpdateCategoryRequest) {
        adUpdateCategoryRequest.setId(id);
        return new ResponseObject(adCategoryService.updateCategory(adUpdateCategoryRequest));
    }

    @GetMapping("/search")
    public ResponseObject searchCategory(final AdFindCategoryRequest adFindCategoryRequest){
        PageableObject<AdCategoryPesponse> adCategoryPesponseList = adCategoryService.searchCategory(adFindCategoryRequest);
        return new ResponseObject(adCategoryPesponseList);
    }

    @GetMapping("/detail/{id}")
    public ResponseObject detailCategory(@PathVariable("id") String id) {
        return new ResponseObject(adCategoryService.findCategoryById(id));
    }

    @GetMapping("/all-cate")
    public ResponseObject detailCategory() {
        return new ResponseObject(adCategoryService.getAllByIdCate());
    }
}
