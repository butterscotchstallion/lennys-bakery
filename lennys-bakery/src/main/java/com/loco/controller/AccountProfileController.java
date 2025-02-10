package com.loco.controller;

import com.loco.dto.SaveAccountProfileDto;
import com.loco.model.AccountProfile;
import com.loco.service.AccountProfileService;
import com.loco.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("api/v1/user")
public class AccountProfileController {
    private final static org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AccountProfileController.class);
    private final AccountProfileService accountProfileService;
    private final UserService userService;

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

    @PostMapping("/profile")
    public ResponseEntity<HashMap<String, String>> saveUserProfile(SaveAccountProfileDto saveAccountProfileDto) {
        long currentUserId = userService.getUserIdFromSession();
        AccountProfile accountProfile = this.accountProfileService.getAccountProfileByUserId(currentUserId);

        if (accountProfile == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

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
    }
}
