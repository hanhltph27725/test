package com.portalprojects.core.member.model.request;

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
public class MeUpdateDescriptionsTodoRequest extends MeTodoAndTodoListRequest{

    @NotNull
    @NotNull
    @NotBlank
    @NotEmpty
    private String idTodoUpdate;

    @NotNull
    @NotBlank
    @NotEmpty
    @Length(max = 5000, message = "Mô tả tối đa 5000 ký tự")
    private String descriptions;

}
