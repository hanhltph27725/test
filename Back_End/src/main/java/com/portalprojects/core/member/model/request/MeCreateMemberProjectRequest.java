package com.portalprojects.core.member.model.request;

import lombok.Getter;
import lombok.Setter;

/**
 * @author thangncph26123
 */
@Getter
@Setter
public class MeCreateMemberProjectRequest {

    private String memberId;

    private String projectId;

    private Short role;
}
