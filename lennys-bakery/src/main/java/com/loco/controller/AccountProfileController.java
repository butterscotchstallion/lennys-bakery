package com.loco.controller;

import com.loco.model.AccountProfile;
import com.loco.service.AccountProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/user")
public class AccountProfileController {
    private final static org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AccountProfileController.class);
    private final AccountProfileService accountProfileService;

    public AccountProfileController(AccountProfileService accountProfileService) {
        this.accountProfileService = accountProfileService;
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
}
