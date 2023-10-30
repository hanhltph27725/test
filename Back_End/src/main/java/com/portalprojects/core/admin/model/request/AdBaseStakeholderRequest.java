package com.portalprojects.core.admin.model.request;

import com.portalprojects.infrastructure.constant.Constants;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

/**
 * @author thangncph26123
 */
@Getter
@Setter
public abstract class AdBaseStakeholderRequest {

    private String id;

    @NotBlank
    @NotEmpty
    private String username;

    @NotEmpty
    @NotBlank
    private String name;

    @NotEmpty
    @NotBlank
    @Pattern(regexp = Constants.REGEX_PHONE_NUMBER)
    private String phoneNumber;

    @NotEmpty
    @NotBlank
    @Pattern(regexp = Constants.REGEX_EMAIL_FE)
    private String emailFE;

    @NotEmpty
    @NotBlank
    @Pattern(regexp = Constants.REGEX_EMAIL_FPT)
    private String emailFPT;

}
