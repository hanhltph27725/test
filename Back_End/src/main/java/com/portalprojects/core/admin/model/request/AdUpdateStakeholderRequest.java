package com.portalprojects.core.admin.model.request;

import com.portalprojects.core.stakeholder.model.request.StBaseStakeholderRequest;
import lombok.Getter;
import lombok.Setter;

/**
 * @author thangncph26123
 */
@Getter
@Setter
public class AdUpdateStakeholderRequest extends AdBaseStakeholderRequest {
    private String id;
}
