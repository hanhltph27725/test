package com.portalprojects.util;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

/**
 * @author thangncph26123
 */
public class DateConverter {

    public static String convertDateToString(long dateInMillis) {
        SimpleDateFormat sdf = new SimpleDateFormat("MMM dd 'at' HH:mm");
        sdf.setTimeZone(TimeZone.getTimeZone("GMT+7"));
        String formattedDate = sdf.format(new Date(dateInMillis));
        return formattedDate;
    }

    public static void main(String[] args) {
        long dateInMillis = new Date().getTime();
        String formattedDate = DateConverter.convertDateToString(dateInMillis);
        System.out.println(formattedDate);
    }
}
