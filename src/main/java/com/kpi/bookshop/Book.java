package com.kpi.bookshop;

import lombok.Builder;
import lombok.Data;

@Data
@Builder(toBuilder = true)
public class Book {
    private long id;
    private String title;
    private String author;
    private String description;
    private int yearPublished;
    private String publisher;
}
