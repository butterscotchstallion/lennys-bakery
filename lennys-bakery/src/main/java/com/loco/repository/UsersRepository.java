package com.loco.repository;

import com.loco.model.Users;
import org.springframework.data.repository.CrudRepository;

public interface UsersRepository extends CrudRepository<Users, Long> {
    Users getUsersById(Long id);
}
