package com.ssu.DB_Project.program.controller;

import com.ssu.DB_Project.announcement.dto.AnnouncementResponse;
import com.ssu.DB_Project.common.ApiResponse;
import com.ssu.DB_Project.program.domain.Program;
import com.ssu.DB_Project.program.dto.ProgramChatRequest;
import com.ssu.DB_Project.program.dto.ProgramProcessRequest;
import com.ssu.DB_Project.program.dto.ProgramResponse;
import com.ssu.DB_Project.program.service.ProgramChatService;
import com.ssu.DB_Project.program.service.ProgramService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/program")
@RequiredArgsConstructor
public class ProgramController {

    private final ProgramService programService;
    private final ProgramChatService programChatService;

    @PostMapping("/process")
    public ResponseEntity<Program> processProgram(@RequestBody ProgramProcessRequest request) {
        Program saved = programService.processAndSave(request);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/chat/ask")
    public ResponseEntity<String> chat(@RequestBody ProgramChatRequest request) {
        String answer = programChatService.ask(request.userId(), request.question());
        return ResponseEntity.ok(answer);
    }
    // 프로그램 단건 조회
    @GetMapping("/{programId}")
    public ResponseEntity<ApiResponse<ProgramResponse>> getProgram(
        @PathVariable String programId) {
        ProgramResponse programResponse = programService.getProgram(programId);
        return ResponseEntity.ok(ApiResponse.success("프로그램 단건 조회가 완료되었습니다.",programResponse));
    }

}
