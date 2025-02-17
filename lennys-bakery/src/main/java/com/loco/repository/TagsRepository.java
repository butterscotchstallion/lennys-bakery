package com.loco.repository;

import com.loco.model.Tags;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TagsRepository extends CrudRepository<Tags, Long> {
    List<Tags> findAllByOrderByNameAsc();
}
