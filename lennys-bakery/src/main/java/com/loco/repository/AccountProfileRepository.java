package com.loco.repository;

import com.loco.model.AccountProfile;
import com.loco.model.Users;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountProfileRepository extends CrudRepository<AccountProfile, Long> {
    AccountProfile getAccountProfileByUser(Users user);
}
