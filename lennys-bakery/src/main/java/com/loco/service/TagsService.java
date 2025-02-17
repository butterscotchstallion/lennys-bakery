package com.loco.service;

import com.loco.model.Tags;
import com.loco.repository.TagsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagsService {
    private final TagsRepository tagsRepository;

    public TagsService(TagsRepository tagsRepository) {
        this.tagsRepository = tagsRepository;
    }

    public List<Tags> getTags() {
        return this.tagsRepository.findAllByOrderByNameAsc();
    }
}
