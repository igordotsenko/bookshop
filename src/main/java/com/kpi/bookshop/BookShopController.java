package com.kpi.bookshop;

import com.kpi.bookshop.Book.BookBuilder;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Collection;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@Controller
@Slf4j
public class BookShopController {
    private static final String DEFAULT_IMAGE_FILE_NAME = "pes.jpg";
    
    private final BooksService booksService;
    private final FileStoreService fileStoreService;

    public BookShopController(
        @Autowired BooksService booksService,
        @Autowired FileStoreService fileStoreService) {
        
        this.booksService = booksService;
        this.fileStoreService = fileStoreService;
    }

    @GetMapping("/")
    public String getIndex(Model model) {
        Collection<Book> activeBooks =  booksService.getAllActiveBooks();
        log.info("Active books: {}", activeBooks);
        model.addAttribute("books", activeBooks);
        return "index.html";
    }

    @GetMapping("/books")
    public ResponseEntity<Collection<Book>> getAllBooks() {
        return ResponseEntity.ok(booksService.getAllActiveBooks());
    }

    @GetMapping("/book/{id}")
    public ResponseEntity<Book> getBook(@PathVariable("id") long bookId) {
        log.info("Get book with id = {}", bookId);
        try {
            return booksService.findActiveById(bookId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());            
        } catch (Exception e) {
            log.error("Error on getting book with id {}", bookId, e);
            return errorResponse();
        }
    }
    
    @RequestMapping(path= "/book/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Book> updateBook(
        @RequestPart("book") Book book,
        @RequestPart(value = "image", required = false) MultipartFile image,
        @PathVariable("id") long bookId) {
        
        log.info("Update book with id = {} to: {}", bookId, book);
        if (bookId <= 0) {
            return ResponseEntity.badRequest().build();
        }
        
        try {
            BookBuilder bookBuilder = book.toBuilder().id(bookId);
            if (image != null) {
                String fileName = fileStoreService.storeFile(image);
                bookBuilder.imageName(fileName);
                log.info("Saved image. Path = {}", fileName);
            }
            log.info("Update book {}", bookBuilder.build());
            return booksService.updateBook(bookBuilder.build()) ?
                ResponseEntity.ok(bookBuilder.build()) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error on book update", e);
            return errorResponse();
        }
    }

    @RequestMapping(path= "/book", method = RequestMethod.POST)
    public ResponseEntity<Long> addBook(
        @RequestPart("book") Book inputBook,
        @RequestPart(value = "image", required = false) MultipartFile image) {
        
        log.info("Image = {}", image);
        Book.BookBuilder bookBuilder = inputBook.toBuilder().id(0);
        try {
            log.info("Save book: {}", inputBook);
            if (image != null) {
                String imageFileName = fileStoreService.storeFile(image);
                bookBuilder.imageName(imageFileName);
                log.info("Saved image. Image name = {}", imageFileName);
            } else {
                bookBuilder.imageName(DEFAULT_IMAGE_FILE_NAME);
            }
            Book newBook = inputBook.toBuilder().id(0).build();
            long savedBookId = booksService.addBook(newBook).getId();
            return ResponseEntity.ok(savedBookId);
        } catch (Exception e) {
            log.error("Error on saving book {}", inputBook, e);
            return errorResponse();
        }
    }
    
    @DeleteMapping("/book/{id}")
    public ResponseEntity<Long> deleteBook(@PathVariable("id") long bookId) {
        log.info("Delete book with id {}", bookId);
        try {
            return booksService.deleteBook(bookId) ?
                ResponseEntity.ok(bookId) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error on deleting book with id {}", bookId, e);
            return errorResponse();
        }
    }
    
    @GetMapping("/image/{filename}")
    public ResponseEntity<byte[]> getBookImage(@PathVariable("filename") String filename) {
        Optional<File> imageFile = fileStoreService.getImageFile(filename);
        if (imageFile.isEmpty()) return ResponseEntity.notFound().build();
        
        try {
            byte[] imageBytes = Files.readAllBytes(imageFile.get().toPath());
            return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(imageBytes);
        } catch (IOException e) {
            e.printStackTrace();
            return errorResponse();
        }
    }
    
    private <T> ResponseEntity<T> errorResponse() {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
    
}
