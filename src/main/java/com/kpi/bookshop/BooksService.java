package com.kpi.bookshop;

import java.util.Collection;
import java.util.Optional;

public interface BooksService {
    
    Collection<Book> getAllActiveBooks(); 
    
    Optional<Book> findActiveById(long bookId);
    
    Book addBook(Book book);
    
    boolean updateBook(Book book);
    
    boolean deleteBook(long bookId);
}
