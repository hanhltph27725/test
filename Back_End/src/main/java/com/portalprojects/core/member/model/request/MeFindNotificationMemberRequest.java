package com.portalprojects.core.member.model.request;

import com.portalprojects.core.common.base.PageableRequest;
import lombok.Getter;
import lombok.Setter;

/**
 * @author thangncph26123
 */
@Getter
@Setter
public class MeFindNotificationMemberRequest extends PageableRequest {

    private String memberId;
}
