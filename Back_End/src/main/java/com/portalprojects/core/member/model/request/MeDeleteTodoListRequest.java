package com.portalprojects.core.member.model.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * @author thangncph26123
 */
@Getter
@Setter
public class MeDeleteTodoListRequest {

    @NotBlank
    @NotNull
    @NotEmpty
    private String id;

    @NotBlank
    @NotNull
    @NotEmpty
    private String projectId;
}
