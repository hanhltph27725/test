package com.portalprojects.core.member.model.request;

import com.portalprojects.infrastructure.constant.EntityProperties;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

/**
 * @author thangncph26123
 */
@Getter
@Setter
public class MeBasePeriodRequest {

    @NotEmpty
    @NotBlank
    @Length(max = EntityProperties.LENGTH_NAME)
    private String name;

    @Length(max = EntityProperties.LENGTH_DESCRIPTION)
    private String descriptions;

    @NotEmpty
    @NotBlank
    private String startTime;

    @NotEmpty
    @NotBlank
    private String endTime;

    @Length(max = EntityProperties.LENGTH_DESCRIPTION)
    private String target;

    @NotNull
    @NotBlank
    private String projectId;
}
