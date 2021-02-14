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
    private double price;
    private int yearPublished;
    private String publisher;
    private boolean isActive;
}
