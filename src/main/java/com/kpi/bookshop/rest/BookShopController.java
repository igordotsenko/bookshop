package com.kpi.bookshop.rest;

import com.kpi.bookshop.Book;
import java.util.Collection;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@Slf4j
public class BookShopController {
    private Set<String> books = new HashSet<>(Set.of("Catch 22", "Star wars", "War and peace", 
        "Book with an extra long name"));
    private Map<Long, Book> idToBooks = new ConcurrentHashMap<>(Map.of(
        1L, Book.builder().id(1).title("Catch 22").build(),
        2L, Book.builder().id(2).title("Star wars").build(),
        3L, Book.builder().id(3).title("War and peace").author("Lev Tolstoy").price(42.5).yearPublished(2000).build(),
        4L, Book.builder().id(4).title("Book with an extra long name").build()
    )) {
    };
    
    private AtomicLong lastId = new AtomicLong(4);
    
    
    @GetMapping("/books")
    public ResponseEntity<Collection<Book>> getAllBooks(Model model) {
        return ResponseEntity.ok(idToBooks.values());
    }
    
    @GetMapping("/")
    public String getIndex(Model model) {
//        model.addAttribute("books", books);
        model.addAttribute("books", idToBooks.values());
        return "index.html";
    }

    @GetMapping("/book/{id}")
    public ResponseEntity<Book> getAllBooks(Model model, @PathVariable("id") long bookId) {
        // TODO handle not found scenario
        log.info("Get book with id = {}", bookId);
        return ResponseEntity.ok(idToBooks.get(bookId));
    }
    
    @GetMapping("/ping")
    @ResponseBody
    public String ping() {
        return "pong";
    } 
    
    @PostMapping("/add")
    public ResponseEntity<Book> addBookName(@RequestBody Book book) {
        log.info("Received book to add: {}", book);
        books.add(book.getTitle());
        log.info("Added book with name {}", book.getTitle());
        return ResponseEntity.ok(book);
    }
    
    @PutMapping("/book/{id}")
    public ResponseEntity<Long> updateBook(@RequestBody Book book, @PathVariable("id") long bookId) {
        if (!idToBooks.containsKey(bookId)) {
            return ResponseEntity.notFound().build();
        }
        
        log.info("Updated book with id = {} to: {}", bookId, book);
        Book updatedBook = book.toBuilder().id(bookId).build();
        idToBooks.put(bookId, updatedBook);
        return ResponseEntity.ok(bookId);
    }

    @PostMapping("/book")
    public ResponseEntity<Long> addBook(@RequestBody Book inputBook) {
        // TODO add error handling
        log.info("Received inputBook to add: {}", inputBook);
        long id = lastId.incrementAndGet();
        Book newBook = inputBook.toBuilder().id(id).build();
        idToBooks.put(id, newBook);
        log.info("Saved inputBook  {}", inputBook);
        return ResponseEntity.ok(newBook.getId());
    }

//    @Override
//    public void addResourceHandlers(ResourceHandlerRegistry registry) {
//        registry.addResourceHandler("/templates/**")
////            .addResourceLocations(extStaticPath)
//            .setCachePeriod(0);
//    }
    
}
