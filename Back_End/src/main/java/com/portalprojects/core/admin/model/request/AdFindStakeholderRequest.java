package com.portalprojects.core.admin.model.request;

import com.portalprojects.core.common.base.PageableRequest;
import lombok.Getter;
import lombok.Setter;

/**
 * @author thangncph26123
 */
@Getter
@Setter
public class AdFindStakeholderRequest extends PageableRequest {
    private String name;
    private String userName;
}
