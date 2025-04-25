package com.mentovia.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class FileStorageService {
    private final Path pdfLocation;
    private final Path videoLocation;
    public FileStorageService(
            @Value("${file.pdf-dir}") String pdfDir,
            @Value("${file.video-dir}") String videoDir
    ) {
        this.pdfLocation = Paths.get(pdfDir).toAbsolutePath().normalize();
        this.videoLocation = Paths.get(videoDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(pdfLocation);
            Files.createDirectories(videoLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directories", e);
        }
    }

    public String storeFile(MultipartFile file, String type) {
        String filename = StringUtils.cleanPath(file.getOriginalFilename());
        try {
            if (filename.contains("..")) throw new RuntimeException("Invalid path sequence in " + filename);
            Path targetDir = "PDF".equalsIgnoreCase(type) ? pdfLocation : videoLocation;
            Path target = targetDir.resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            return filename; // Only return clean filename
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + filename, e);
        }
    }

    // Add this helper method
    private String detectContentType(String filename) {
        String extension = StringUtils.getFilenameExtension(filename).toLowerCase();
        return switch (extension) {
            case "pdf" -> "application/pdf";
            case "mp4" -> "video/mp4";
            case "webm" -> "video/webm";
            case "ogg" -> "video/ogg";
            default -> MediaType.APPLICATION_OCTET_STREAM_VALUE;
        };
    }


    public Resource loadAsResource(String filename) {
        try {
            // Check PDF directory first
            Path pdfPath = pdfLocation.resolve(filename).normalize();
            Resource pdfResource = new UrlResource(pdfPath.toUri());
            if (pdfResource.exists() && pdfResource.isReadable()) {
                return pdfResource;
            }

            // Check Video directory if not found in PDF
            Path videoPath = videoLocation.resolve(filename).normalize();
            Resource videoResource = new UrlResource(videoPath.toUri());
            if (videoResource.exists() && videoResource.isReadable()) {
                return videoResource;
            }

            throw new RuntimeException("File not found: " + filename);
        } catch (Exception ex) {
            throw new RuntimeException("File not found: " + filename, ex);
        }
    }

    // Add this method to the existing service
    public void deleteFile(String filename, String type) {
        try {
            Path targetDir = "PDF".equalsIgnoreCase(type) ? pdfLocation : videoLocation;
            Path filePath = targetDir.resolve(filename).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file: " + filename, e);
        }
    }
}




