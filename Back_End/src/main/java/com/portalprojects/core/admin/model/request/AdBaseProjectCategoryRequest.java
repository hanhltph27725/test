package com.portalprojects.core.admin.model.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

/**
 * @author NguyenVinh
 */
@Setter
@Getter
public abstract class AdBaseProjectCategoryRequest {

    @NotEmpty
    @NotBlank
    private String projectId;

    @NotEmpty
    @NotBlank
    private String categoryId;

}
