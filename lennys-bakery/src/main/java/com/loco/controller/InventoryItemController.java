package com.loco.controller;

import com.loco.dto.GetInventoryItemsByTagsDto;
import com.loco.exception.UserNotFoundException;
import com.loco.model.InventoryItemImages;
import com.loco.model.InventoryItems;
import com.loco.model.Tags;
import com.loco.service.InventoryItemImagesService;
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
    private final InventoryItemImagesService inventoryItemImagesService;
    InventoryItemService inventoryItemService;
    @Value("${inventoryItem.upload.path}")
    private String uploadPath;

    public InventoryItemController(InventoryItemImagesService inventoryItemImagesService, InventoryItemService inventoryItemService) {
        this.inventoryItemImagesService = inventoryItemImagesService;
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

    private Boolean updateInventoryItemImages(ArrayList<String> filenames, InventoryItems inventoryItem) {
        try {
            Set<InventoryItemImages> images = inventoryItem.getInventoryItemImages();
            for (String filename : filenames) {
                InventoryItemImages image = new InventoryItemImages();
                image.setImageFilename(filename);
                inventoryItemImagesService.saveInventoryItemImage(image);
                images.add(image);
            }
            inventoryItem.setInventoryItemImages(images);
            inventoryItemService.saveInventoryItem(inventoryItem);
            log.info("Updated inventory item images");
            return true;
        } catch (Exception e) {
            log.error("Error setting images for item  {}", e.getMessage(), e);
            return false;
        }
    }

    @PostMapping("/item/{slug}/image")
    public ResponseEntity<HashMap<String, String>> uploadImage(@RequestParam("files") MultipartFile[] files, @PathVariable String slug) {
        ArrayList<String> filenames;
        HashMap<String, String> response = new HashMap<>();
        try {
            if (slug == null || slug.isEmpty()) {
                response.put("status", "ERROR");
                response.put("message", "Inventory item not found.");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            if (files == null || files.length == 0) {
                response.put("status", "ERROR");
                response.put("message", "No files uploaded.");
                log.error("No files uploaded");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            InventoryItems inventoryItem = this.inventoryItemService.getInventoryItemBySlug(slug);
            if (inventoryItem == null) {
                response.put("status", "ERROR");
                response.put("message", "Inventory item not found");
                log.error("Inventory item not found for slug: {}", slug);
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }

            String[] validFileTypes = {"image/jpeg", "image/png", "image/jpg"};
            this.validateFiles(files, validFileTypes);

            filenames = this.transferFilesAndReturnFilenames(files);

            Boolean imagesUpdateSuccessful = updateInventoryItemImages(filenames, inventoryItem);
            if (!imagesUpdateSuccessful) {
                response.put("status", "ERROR");
                response.put("message", "Error updating inventory item images");
                log.error("Error updating inventory item images");
                return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            log.info("Uploaded new product images for item {}", inventoryItem.getName());
            
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
        existingInventoryItem.setRapidShipAvailable(inventoryItem.getRapidShipAvailable());

        inventoryItemService.saveInventoryItem(existingInventoryItem);

        response.put("status", "OK");
        response.put("message", "Inventory item updated");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/search/tags")
    public ResponseEntity<List<InventoryItems>> getInventoryItemsByTags(@RequestBody GetInventoryItemsByTagsDto getInventoryItemsByTagsDto) {
        Set<Tags> searchTags = getInventoryItemsByTagsDto.getTags();
        if (searchTags == null || searchTags.isEmpty()) {
            log.error("No tags provided for search");
            return ResponseEntity.ok(inventoryItemService.getAllInventoryItems());
        }

        log.debug("Searching for inventory items with tags: {}", searchTags);

        List<InventoryItems> itemsWithTags = inventoryItemService.findItemsByAnyTag(searchTags);

        return ResponseEntity.ok(itemsWithTags);
    }
}
