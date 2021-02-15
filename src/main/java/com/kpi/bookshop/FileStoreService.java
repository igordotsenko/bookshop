package com.kpi.bookshop;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
@Slf4j
public class FileStoreService {
    private final Path rootLocation;

    public FileStoreService(@Value("${book.image.storage}") String storagePath) {
         rootLocation = Path.of(storagePath);
    }

    public String storeFile(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new StorageException("Failed to store empty file");
            }
            
            String fileName = System.nanoTime() + "_" + file.getOriginalFilename();
            Path destinationFile = rootLocation.resolve(fileName);
            
            if (!destinationFile.getParent().equals(rootLocation.toAbsolutePath())) {
                // This is a security check
                throw new StorageException("Cannot store file outside current directory");
            }
            
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }
            return fileName;
        }
        catch (IOException e) {
            throw new StorageException("Failed to store file", e);
        }
    }
    
    public Optional<File> getImageFile(String fileName) {
        File imageFile = rootLocation.resolve(fileName).toFile();
        return imageFile.exists() ? Optional.of(imageFile) : Optional.empty();
    }
}
