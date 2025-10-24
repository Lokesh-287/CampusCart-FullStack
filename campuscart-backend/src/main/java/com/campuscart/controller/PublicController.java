package com.campuscart.controller;

import com.campuscart.dto.QueryRequest;
import com.campuscart.model.Query;
import com.campuscart.repository.QueryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    @Autowired
    private QueryRepository queryRepository;

    @PostMapping("/contact")
    public ResponseEntity<String> submitQuery(@RequestBody QueryRequest queryRequest) {
        Query query = new Query();
        query.setName(queryRequest.getName());
        query.setEmail(queryRequest.getEmail());
        query.setMessage(queryRequest.getMessage());
        query.setSubmittedAt(LocalDateTime.now());
        queryRepository.save(query);
        return ResponseEntity.ok("Query submitted successfully!");
    }
}