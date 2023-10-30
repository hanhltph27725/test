package com.portalprojects.util;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * @author thangncph26123
 */

@Component
public class ScheduleDaily {

    @Scheduled(fixedDelay = 3600000)
    public void dailyChecking() {

    }
}
