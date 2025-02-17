package com.loco.controller;

import com.loco.exception.UserNotFoundException;
import com.loco.model.InventoryItems;
import com.loco.service.InventoryItemService;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("api/v1/inventory")
public class InventoryItemController {
    private final static Logger log = LoggerFactory.getLogger(InventoryItemController.class);
    InventoryItemService inventoryItemService;
    @Value("${inventoryItem.upload.path}")
    private String uploadPath;

    public InventoryItemController(InventoryItemService inventoryItemService) {
        this.inventoryItemService = inventoryItemService;
    }

    @GetMapping("")
    public ResponseEntity<List<InventoryItems>> inventoryList() {
        List<InventoryItems> inventoryItemList = this.inventoryItemService.getAllInventoryItems();
        return ResponseEntity.ok(inventoryItemList);
    }

    @GetMapping("/search")
    public ResponseEntity<List<InventoryItems>> inventoryItemSearch(@RequestParam String q) {
        List<InventoryItems> inventoryItemList = this.inventoryItemService.getInventoryItemsBySearchText(q);
        return ResponseEntity.ok(inventoryItemList);
    }

    @GetMapping("/item/{slug}")
    public ResponseEntity<InventoryItems> inventoryItemBySlug(@PathVariable String slug) {
        InventoryItems inventoryItem = this.inventoryItemService.getInventoryItemBySlug(slug);
        if (inventoryItem == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(inventoryItem);
    }

    private void validateFiles(MultipartFile[] files, String[] validFileTypes) {
        for (MultipartFile file : files) {
            ResponseEntity<Map<String, String>> validationResult = validateSingleFile(file, validFileTypes);
            if (validationResult != null) {
                return;
            }
        }
    }

    private ResponseEntity<Map<String, String>> validateSingleFile(MultipartFile file, String[] validFileTypes) {
        Map<String, String> response = new HashMap<>();

        if (file.getContentType() == null) {
            response.put("status", "ERROR");
            response.put("message", "File type cannot be null");
            log.error("File type is null for file: {}", file.getOriginalFilename());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        if (!Arrays.asList(validFileTypes).contains(file.getContentType())) {
            response.put("status", "ERROR");
            response.put("message", "Invalid file type");
            log.error("Invalid file type: {}", file.getContentType());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        int maxAvatarFileSizeInBytes = 500000;
        if (file.getSize() > maxAvatarFileSizeInBytes) {
            response.put("status", "ERROR");
            response.put("message", "File too large");
            log.error("File too large: {}", file.getSize());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        return null;
    }

    /**
     * Transfer files and return the filenames
     *
     * @param files multipart files
     * @return filenames
     */
    private ArrayList<String> transferFilesAndReturnFilenames(MultipartFile[] files) {
        try {
            ArrayList<String> filenames = new ArrayList<>();
            for (MultipartFile file : files) {
                String originalFileExtension = FilenameUtils.getExtension(file.getOriginalFilename());
                String imageFilenameWithExtension = UUID.randomUUID() + "." + originalFileExtension;
                String imageUploadPathWithFilename = uploadPath + imageFilenameWithExtension;

                file.transferTo(new java.io.File(imageUploadPathWithFilename));
                log.info("Uploaded new product image: {}", imageUploadPathWithFilename);

                filenames.add(imageFilenameWithExtension);
            }
            return filenames;
        } catch (Exception e) {
            log.error("Error uploading avatar: {}", e.getMessage(), e);
        }
        return null;
    }

    @PostMapping("/item/{slug}/image")
    public ResponseEntity<HashMap<String, String>> uploadImage(@RequestParam("files") MultipartFile[] files) {
        HashMap<String, String> response = new HashMap<>();
        try {
            if (files == null || files.length == 0) {
                response.put("status", "ERROR");
                response.put("message", "No files uploaded.");
                log.error("No files uploaded");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            String[] validFileTypes = {"image/jpeg", "image/png", "image/jpg"};
            this.validateFiles(files, validFileTypes);

            ArrayList<String> filenames = this.transferFilesAndReturnFilenames(files);

            // Add new product images
//            for (String filename : filenames) {
//
//            }

            response.put("status", "OK");
            response.put("message", "Product images uploaded.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Error uploading avatar: {}", e.getMessage(), e);
            response.put("status", "ERROR");
            response.put("message", "Error uploading product images");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/item/{slug}")
    public ResponseEntity<HashMap<String, String>> updateInventoryItem(@PathVariable String slug, @RequestBody InventoryItems inventoryItem) {
        HashMap<String, String> response = new HashMap<>();
        InventoryItems existingInventoryItem = this.inventoryItemService.getInventoryItemBySlug(slug);

        if (existingInventoryItem == null) {
            return ResponseEntity.notFound().build();
        }

        existingInventoryItem.setName(inventoryItem.getName());
        existingInventoryItem.setShortDescription(inventoryItem.getShortDescription());
        existingInventoryItem.setDescription(inventoryItem.getDescription());
        existingInventoryItem.setPrice(inventoryItem.getPrice());
        existingInventoryItem.setTags(inventoryItem.getTags());
        inventoryItemService.saveInventoryItem(existingInventoryItem);

        response.put("status", "OK");
        response.put("message", "Inventory item updated");

        return ResponseEntity.ok(response);
    }
}
