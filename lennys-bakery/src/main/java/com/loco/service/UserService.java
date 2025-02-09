package com.loco.service;

import com.loco.model.Users;
import com.loco.repository.UsersRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UsersRepository usersRepository;

    public UserService(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    public Users getUserById(long userId) {
        return usersRepository.getUsersById(userId);
    }

    /**
     * Placeholder method until user management is implemented
     *
     * @return int userId
     */
    public int getUserIdFromSession() {
        return 2;
    }
}
