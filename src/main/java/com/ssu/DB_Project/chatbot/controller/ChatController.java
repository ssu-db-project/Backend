package com.ssu.DB_Project.chatbot.controller;

import com.ssu.DB_Project.chatbot.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    // 챗봇 요청용 DTO (Request Body)
    public record ChatRequest(String question) {}

    @PostMapping("/{policyId}")
    public String chatWithPolicy(
            @PathVariable Long policyId,
            @RequestBody ChatRequest request
    ) {
        return chatService.askPolicy(policyId, request.question());
    }
}
