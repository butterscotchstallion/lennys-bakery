package com.loco.controller;

import com.loco.dto.SaveAccountProfileDto;
import com.loco.exception.UserNotFoundException;
import com.loco.model.AccountProfile;
import com.loco.service.AccountProfileService;
import com.loco.service.UserService;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.HashMap;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/user")
public class AccountProfileController {
    private final static Logger log = LoggerFactory.getLogger(AccountProfileController.class);
    private final AccountProfileService accountProfileService;
    private final UserService userService;
    private final String[] validFileTypes = {"image/jpeg", "image/png", "image/jpg"};
    private final int maxAvatarFileSizeInBytes = 500000;
    @Value("${upload.path}")
    private String uploadPath;

    public AccountProfileController(AccountProfileService accountProfileService, UserService userService) {
        this.accountProfileService = accountProfileService;
        this.userService = userService;
    }

    @GetMapping("/{userId}/profile")
    public ResponseEntity<AccountProfile> getUserProfile(@PathVariable Long userId) {
        AccountProfile accountProfile = accountProfileService.getAccountProfileByUserId(userId);
        if (accountProfile == null) {
            log.debug("User ID {} not found", userId);
            return ResponseEntity.notFound().build();
        }
        log.debug("Account profile for user {} found: {}", userId, accountProfile);
        return ResponseEntity.ok(accountProfile);
    }

    @PostMapping("/profile/avatar")
    public ResponseEntity<HashMap<String, String>> uploadAvatar(@RequestParam("file") MultipartFile file) {
        HashMap<String, String> response = new HashMap<>();
        try {
            if (file == null || file.isEmpty()) {
                response.put("status", "ERROR");
                response.put("message", "No file uploaded.");
                log.error("No file uploaded");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            if (file.getContentType() != null && !Arrays.asList(validFileTypes).contains(file.getContentType())) {
                response.put("status", "ERROR");
                response.put("message", "Invalid file type.");
                log.error("Invalid file type: {}", file.getContentType());
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            if (file.getSize() > this.maxAvatarFileSizeInBytes) {
                response.put("status", "ERROR");
                response.put("message", "File too large");
                log.error("File too large: {}", file.getSize());
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            String originalFileExtension = FilenameUtils.getExtension(file.getOriginalFilename());
            String avatarFilenameWithExtension = this.getAvatarFilename() + "." + originalFileExtension;
            String avatarUploadPathWithFilename = uploadPath + avatarFilenameWithExtension;

            file.transferTo(new java.io.File(avatarUploadPathWithFilename));

            log.info("Uploaded new avatar: {}", avatarUploadPathWithFilename);

            this.updateAccountProfileAvatar(avatarFilenameWithExtension);

            response.put("status", "OK");
            response.put("message", "Account avatar uploaded.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Error uploading avatar: {}", e.getMessage(), e);
            response.put("status", "ERROR");
            response.put("message", "Error uploading avatar");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private String getAvatarFilename() {
        UUID uuid = UUID.randomUUID();
        return uuid.toString();
    }

    /**
     * Update account profile avatarFilename using randomized filename
     * from upload
     *
     * @param filename
     */
    private void updateAccountProfileAvatar(String filename) throws UserNotFoundException {
        AccountProfile accountProfile = this.getAccountProfileOrThrow();

        log.debug("Setting avatar filename for user {}", accountProfile.getUser().getUsername());

        accountProfile.setAvatarFilename(filename);
        this.accountProfileService.saveAccountProfile(accountProfile);

        log.debug("Saved account profile avatarFilename: {}", accountProfile.getAvatarFilename());
    }

    private AccountProfile getAccountProfileOrThrow() throws UserNotFoundException {
        long currentUserId = userService.getUserIdFromSession();
        AccountProfile accountProfile = this.accountProfileService.getAccountProfileByUserId(currentUserId);
        if (accountProfile == null) {
            throw new UserNotFoundException();
        }
        return accountProfile;
    }

    @PostMapping("/profile")
    public ResponseEntity<HashMap<String, String>> saveUserProfile(SaveAccountProfileDto saveAccountProfileDto) {
        try {
            AccountProfile accountProfile = this.getAccountProfileOrThrow();

            if (saveAccountProfileDto.getAbout() != null && saveAccountProfileDto.getAbout().length() > 1) {
                accountProfile.setAbout(saveAccountProfileDto.getAbout());
            }

            if (saveAccountProfileDto.getAvatarFilename() != null && saveAccountProfileDto.getAvatarFilename().length() > 1) {
                accountProfile.setAvatarFilename(saveAccountProfileDto.getAvatarFilename());
            }

            this.accountProfileService.saveAccountProfile(accountProfile);

            HashMap<String, String> response = new HashMap<>();
            response.put("status", "OK");
            response.put("message", "Account profile updated");
            response.put("avatarFilename", accountProfile.getAvatarFilename());

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
