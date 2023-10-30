package com.portalprojects.core.member.model.response;

import com.portalprojects.entity.Image;
import com.portalprojects.entity.base.IsIdentified;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

/**
 * @author thangncph26123
 */
@Projection(types = {Image.class})
public interface MeImageResponse extends IsIdentified {

    @Value("#{target.name_file}")
    String getNameFile();

    @Value("#{target.name_image}")
    String getNameImage();

    @Value("#{target.status_image}")
    Integer getStatusImage();

    @Value("#{target.todo_id}")
    String getTodoId();

    @Value("#{target.created_date}")
    Long getCreatedDate();
}
