package com.portalprojects.core.admin.model.request;

import com.portalprojects.core.common.base.PageableRequest;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdFindCategoryRequest extends PageableRequest {

    private String name;
}
