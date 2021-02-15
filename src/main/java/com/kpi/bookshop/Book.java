package com.kpi.bookshop;

import java.util.Locale;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
@Builder(toBuilder = true)
public class Book {
    @Id
    private long id;
    private String title;
    private String author;
    private String description;
    private double price;
    private int yearPublished;
    private String publisher;
    private boolean isDeleted;
    
    public boolean isActive() {
        return !isDeleted();
    }
    
    public String getPriceFormatted() {
        return String.format(Locale.US, "%.2f", price);
    }
}
