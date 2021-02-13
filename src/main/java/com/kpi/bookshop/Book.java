package com.kpi.bookshop;

import lombok.Data;

@Data
public class Book {
    private long id;
    private String name;
    private String author;
    private String description;
    private int yearPublished;
    private String publisher;
}
