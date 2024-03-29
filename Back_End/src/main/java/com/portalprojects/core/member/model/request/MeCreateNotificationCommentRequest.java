package com.portalprojects.core.member.model.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * @author thangncph26123
 */
@Getter
@Setter
public class MeCreateNotificationCommentRequest {

    private List<String> listMemberId;

    private List<String> listEmail;

    @NotNull
    @NotBlank
    @NotEmpty
    private String todoId;

    @NotNull
    @NotBlank
    @NotEmpty
    private String url;

    @NotNull
    @NotBlank
    @NotEmpty
    private String idUser;

    @NotNull
    @NotBlank
    @NotEmpty
    private String username;
}
