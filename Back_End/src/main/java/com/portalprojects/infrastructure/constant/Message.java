package com.portalprojects.infrastructure.constant;

import com.portalprojects.util.PropertiesReader;

/**
 * @author thangncph26123
 */

public enum Message {

    SUCCESS("Success"),

    //    ERROR_UNKNOWN("Error Unknown"),
    ERROR_UNKNOWN("Error Unknown"),
    PROJECT_NOT_EXISTS(PropertiesReader.getProperty(PropertyKeys.PROJECT_NOT_EXISTS)),
    STAKEHOLDER_NOT_EXISTS(PropertiesReader.getProperty(PropertyKeys.STAKEHOLDER_NOT_EXISTS)),

    USER_NAME_ALREADY_EXISTS(PropertiesReader.getProperty(PropertyKeys.USER_NAME_ALREADY_EXISTS)),
    INVALID_DATE(PropertiesReader.getProperty(PropertyKeys.INVALID_DATE)),
    INVALID_END_TIME(PropertiesReader.getProperty(PropertyKeys.INVALID_END_TIME)),
    PERIOD_OVERLAP(PropertiesReader.getProperty(PropertyKeys.PERIOD_OVERLAP)),
    PERIOD_NOT_EXISTS(PropertiesReader.getProperty(PropertyKeys.PERIOD_NOT_EXISTS)),
    MEMBER_PROJECT_DELETE(PropertiesReader.getProperty(PropertyKeys.MEMBER_PROJECT_DELETE)),
    CODE_PROJECT_ALREADY_EXISTS(PropertiesReader.getProperty(PropertyKeys.CODE_PROJECT_ALREADY_EXISTS)),
    CODE_MENBER_PROJECT_ALREADY_EXISTS(PropertiesReader.getProperty(PropertyKeys.CODE_MENBER_PROJECT_ALREADY_EXISTS)),
    MEMBER_PROJECT_NOT_EXISTS(PropertiesReader.getProperty(PropertyKeys.MEMBER_PROJECT_NOT_EXISTS)),
    TO_DO_NOT_EXISTS(PropertiesReader.getProperty(PropertyKeys.TO_DO_NOT_EXISTS)),
    DESCRIPTIONS_TOO_LONG(PropertiesReader.getProperty(PropertyKeys.DESCRIPTIONS_TOO_LONG)),
    CODE_CATEGORY_ALREADY_EXISTS(PropertiesReader.getProperty(PropertyKeys.CODE_CATEGORY_ALREADY_EXISTS)),
    CATEGORY_NOT_EXISTS(PropertiesReader.getProperty(PropertyKeys.CATEGORY_NOT_EXISTS)),
    CODE_LABEL_ALREADY_EXISTS(PropertiesReader.getProperty(PropertyKeys.CODE_LABEL_ALREADY_EXISTS)) ,
    LABEL_NOT_EXISTS(PropertiesReader.getProperty(PropertyKeys.LABEL_NOT_EXISTS)) ,
    TODO_LIST_NOT_EXISTS(PropertiesReader.getProperty(PropertyKeys.TODO_LIST_NOT_EXISTS)) ,
    COMMENT_NOT_EXISTS(PropertiesReader.getProperty(PropertyKeys.COMMENT_NOT_EXISTS)) ,
    IMAGE_NOT_EXISTS(PropertiesReader.getProperty(PropertyKeys.IMAGE_NOT_EXISTS)) ,
    RESOURCE_NOT_EXISTS(PropertiesReader.getProperty(PropertyKeys.RESOURCE_NOT_EXISTS)) ;

    private String message;

    Message(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

}
