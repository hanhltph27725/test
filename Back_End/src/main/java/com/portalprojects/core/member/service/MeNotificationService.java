package com.portalprojects.core.member.service;

import com.portalprojects.core.member.model.request.MeCreateNotificationCommentRequest;
import jakarta.validation.Valid;

/**
 * @author thangncph26123
 */
public interface MeNotificationService {

    void createNotification(@Valid MeCreateNotificationCommentRequest request);
}
