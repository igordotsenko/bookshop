package com.kpi.bookshop.rest;

import com.kpi.bookshop.Book;
import java.util.HashSet;
import java.util.Set;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@Slf4j
public class BookShopController {
    private Set<String> books = new HashSet<>(Set.of("Catch 22", "Star wars", "War and peace", 
        "Book with an extra long name"));
    
    @GetMapping("/books")
    public Set<String> getAllBooks(Model model) {
        return books;
    }
    
    @GetMapping("/")
    public String getIndex(Model model) {
        model.addAttribute("books", books);
        return "index.html";
    }
    
    @GetMapping("/ping")
    @ResponseBody
    public String ping() {
        return "pong";
    } 
    
    @PostMapping("/add")
    public ResponseEntity<Book> addBookName(@RequestBody Book book) {
        log.info("Received book to add: {}", book);
        books.add(book.getName());
        log.info("Added book with name {}", book.getName());
        return ResponseEntity.ok(book);
    }

//    @Override
//    public void addResourceHandlers(ResourceHandlerRegistry registry) {
//        registry.addResourceHandler("/templates/**")
////            .addResourceLocations(extStaticPath)
//            .setCachePeriod(0);
//    }
    
}
