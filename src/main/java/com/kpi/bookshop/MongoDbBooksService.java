package com.kpi.bookshop;

import java.util.Collection;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class MongoDbBooksService implements BooksService {
    private final BooksRepository booksRepository;
    private final NextSequenceService nextSequenceService;

    public MongoDbBooksService(
        @Autowired BooksRepository booksRepository, 
        @Autowired NextSequenceService nextSequenceService) {
        
        this.booksRepository = booksRepository;
        this.nextSequenceService = nextSequenceService;
    }

    @Override
    public Collection<Book> getAllActiveBooks() {
        return booksRepository.findByIsDeleted(false);
    }

    @Override
    public Optional<Book> findActiveById(long bookId) {
        return booksRepository.findById(bookId)
            .filter(Book::isActive);
    }

    @Override
    public Book addBook(Book book) {
        if (book.getId() == 0) {
            book.setId(nextSequenceService.getNextSequence("books"));
        }
        return booksRepository.save(book);
    }

    @Override
    public Optional<Book> updateBook(Book updatedBook) {
        return booksRepository.findById(updatedBook.getId()).map(book -> {
            if (updatedBook.getImageName() == null) {
                updatedBook.setImageName(book.getImageName());
            }
            booksRepository.save(updatedBook);
            return updatedBook;
        });
    }

    @Override
    public boolean deleteBook(long bookId) {
        return booksRepository.findById(bookId).map(book -> {
            book.setDeleted(true);
            booksRepository.save(book);
            return true;
        }).orElse(false);
    }
}
