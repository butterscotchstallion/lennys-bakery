package com.loco.controller;

import com.loco.dto.SaveAccountProfileDto;
import com.loco.exception.UserNotFoundException;
import com.loco.model.AccountProfile;
import com.loco.service.AccountProfileService;
import com.loco.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.util.HashMap;

@RestController
@RequestMapping("api/v1/user")
public class AccountProfileController {
    private final static Logger log = LoggerFactory.getLogger(AccountProfileController.class);
    private final AccountProfileService accountProfileService;
    private final UserService userService;
    // 500kb
    private final int maxAvatarFileSize = 500000;
    private String avatarTempStorageDir = null;

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

    private String createTempDir() throws IOException {
        if (avatarTempStorageDir == null) {
            String tmpdir = Files.createTempDirectory("tmpDirPrefix").toFile().getAbsolutePath();
            String tmpDirsLocation = System.getProperty("java.io.tmpdir");
            this.avatarTempStorageDir = tmpDirsLocation + tmpdir;
            return this.avatarTempStorageDir;
        } else {
            return avatarTempStorageDir;
        }
    }

    @PostMapping("/profile/avatar")
    public ResponseEntity<HashMap<String, String>> uploadAvatar(@RequestParam("file") byte[] file) {
        try {
            String tmpDir = this.createTempDir();

            HashMap<String, String> response = new HashMap<>();
            response.put("status", "OK");
            response.put("message", "Account avatar uploaded.");
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (IOException e) {
            throw new RuntimeException(e);
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
