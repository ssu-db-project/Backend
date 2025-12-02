package com.ssu.DB_Project.search.controller;

import com.ssu.DB_Project.search.dto.SearchRequest;
import com.ssu.DB_Project.search.dto.SearchResultDto;
import com.ssu.DB_Project.search.service.SearchService;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/search")
public class SearchController {

    private final SearchService searchService;

    @PostMapping
    public List<SearchResultDto> search(@RequestBody SearchRequest request) {
        return searchService.search(request.getQuery());
    }
}
