package com.portalprojects.core.stakeholder.model.request;

import com.portalprojects.core.common.base.PageableRequest;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StFindByNameAndCategoryProjectRequest extends PageableRequest {
    private String name;
    private String nameCate;
}
