package com.portalprojects.core.admin.model.response;

import com.portalprojects.entity.Stakeholder;
import com.portalprojects.entity.base.IsIdentified;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

@Projection(types = {Stakeholder.class})
public interface AdStakeholderResponse extends IsIdentified {

    Integer getStt();

    @Value("#{target.username}")
    String getUserName();

    @Value("#{target.name}")
    String getName();

    @Value("#{target.phone_number}")
    String getPhoneNumber();

    @Value("#{target.emailFE}")
    String getEmailFe();

    @Value("#{target.emailFPT}")
    String getEmailFpt();

    @Value("#{target.created_date}")
    Long  getCreateDate();
}
