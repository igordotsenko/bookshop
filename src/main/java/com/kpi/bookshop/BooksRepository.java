package com.kpi.bookshop;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BooksRepository extends MongoRepository<Book, Long> {
    
    List<Book> findByIsDeleted(boolean isDeleted);
}
