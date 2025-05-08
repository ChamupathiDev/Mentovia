package com.mentovia.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "posts")
public class Post {
    @Id
    private String id;
    
    private String authorId;
    private String authorUsername;
    private String authorFirstName;
    private String authorLastName;
    private String authorProfilePicture;
    
    private String content;
    private String mediaUrl;
    private String mediaType; // IMAGE, VIDEO, etc.
    
    @Builder.Default
    private Set<String> likes = new HashSet<>();
    
    @Builder.Default
    private List<Comment> comments = new ArrayList<>();
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // Fields to track if this post is a shared post
    private String originalPostId;
    private String shareMessage;
    
    // Track who shared this post
    private Set<String> shares;
    
    // Helper method to check if this is a shared post
    public boolean isSharedPost() {
        return originalPostId != null && !originalPostId.isEmpty();
    }
    
    // Nested Comment class
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Comment {
        private String id;
        private String userId;
        private String username;
        private String userProfilePicture;
        private String content;
        private LocalDateTime createdAt;
    }
}
