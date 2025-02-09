package com.loco.service;

import com.loco.model.AccountProfile;
import com.loco.model.Users;
import com.loco.repository.AccountProfileRepository;
import org.springframework.stereotype.Service;

@Service
public class AccountProfileService {
    private final AccountProfileRepository accountProfileRepository;
    private final UserService userService;

    public AccountProfileService(AccountProfileRepository accountProfileRepository, UserService userService) {
        this.accountProfileRepository = accountProfileRepository;
        this.userService = userService;
    }

    public void saveAccountProfile(AccountProfile accountProfile) {
        accountProfileRepository.save(accountProfile);
    }

    public AccountProfile getAccountProfileByUserId(long userId) {
        Users user = userService.getUserById(userId);
        if (user != null) {
            return accountProfileRepository.getAccountProfileByUser(user);
        }
        return null;
    }
}
