package com.loco.controller;

import com.loco.model.Tags;
import com.loco.service.TagsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/tags")
public class TagsController {
    private final TagsService tagsService;

    public TagsController(TagsService tagsService) {
        this.tagsService = tagsService;
    }

    @GetMapping("")
    public ResponseEntity<List<Tags>> getTags() {
        return ResponseEntity.ok(tagsService.getTags());
    }
}
