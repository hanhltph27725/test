package com.portalprojects.util;

import java.io.File;

/**
 * @author thangncph26123
 */
public class Main {

    public static void main(String[] args) {
        String currentDirectory = System.getProperty("user.dir");
        String folderName = "Blo";
        String absoluteFilePath = currentDirectory + "/src/main/resources/static/" + folderName;
        File folder = new File(absoluteFilePath);
        if (!folder.exists()) {
            folder.mkdirs();
        }
    }
}
