package com.ssu.DB_Project.user.controller;

import com.ssu.DB_Project.user.domain.User;
import com.ssu.DB_Project.user.dto.UserRegisterRequest;
import com.ssu.DB_Project.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public User register(@RequestBody UserRegisterRequest request) {
        return userService.registerUser(request);
    }
}
