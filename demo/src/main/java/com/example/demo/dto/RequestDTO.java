package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestDTO {
    private String targetToken;
    private String title;
    private String body;
    private String path;
}
