package com.loco.controller;

import com.loco.dto.SaveAccountProfileDto;
import com.loco.exception.UserNotFoundException;
import com.loco.model.AccountProfile;
import com.loco.service.AccountProfileService;
import com.loco.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.HashMap;

@RestController
@RequestMapping("api/v1/user")
public class AccountProfileController {
    private final static Logger log = LoggerFactory.getLogger(AccountProfileController.class);
    private final AccountProfileService accountProfileService;
    private final UserService userService;
    private final String[] validFileTypes = {"image/jpeg", "image/png", "image/jpg"};
    @Value("${upload.path}")
    private String uploadPath;
    @Value("${spring.servlet.multipart.max-file-size}")
    private String maxFileSize;

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
        try {
            HashMap<String, String> response = new HashMap<>();

            if (file == null || file.isEmpty()) {
                response.put("status", "ERROR");
                response.put("message", "No file uploaded.");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            if (file.getContentType() != null && !Arrays.asList(validFileTypes).contains(file.getContentType())) {
                response.put("status", "ERROR");
                response.put("message", "Invalid file type.");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            if (file.getSize() > 1_000_000) {
                response.put("status", "ERROR");
                response.put("message", "File too large");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            try {
                file.transferTo(new java.io.File(uploadPath + file.getOriginalFilename()));
                response.put("status", "OK");
                response.put("message", "Account avatar uploaded.");
                return new ResponseEntity<>(response, HttpStatus.OK);
            } catch (Exception e) {
                response.put("status", "ERROR");
                response.put("message", "Error uploading avatar");
                return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
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
