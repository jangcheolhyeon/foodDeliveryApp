package com.example.demo.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class PageController {
    @GetMapping("/index1")
    public String IndexPage(){
        return "index";
    }

    @GetMapping("/hello1")
    public String homePage(){
        return "/hello1.html";
    }

    @GetMapping("/hello2")
    public String homePage1(){
        return "hello1";
    }

}
