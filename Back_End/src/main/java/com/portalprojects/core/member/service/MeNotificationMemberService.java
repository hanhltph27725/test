package com.portalprojects.core.member.service;

import com.portalprojects.core.common.base.PageableObject;
import com.portalprojects.core.member.model.request.MeFindNotificationMemberRequest;
import com.portalprojects.core.member.model.response.MeNotificationMemberResponse;

/**
 * @author thangncph26123
 */
public interface MeNotificationMemberService {

    PageableObject<MeNotificationMemberResponse> getAllNotificationMember(final MeFindNotificationMemberRequest request);

    Integer countNotificationMember(String memberId);

    String updateStatus(String idNotificationMember);
}


