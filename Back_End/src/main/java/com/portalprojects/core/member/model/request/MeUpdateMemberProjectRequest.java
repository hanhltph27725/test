package com.portalprojects.core.member.model.request;

import lombok.Getter;
import lombok.Setter;

/**
 * @author thangncph26123
 */
@Getter
@Setter
public class MeUpdateMemberProjectRequest {

    private String idMemberProject;

    private Short statusWork;

    private Short role;
}
