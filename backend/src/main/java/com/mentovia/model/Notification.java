package com.mentovia.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;
    
    private String userId;      // ID of the user receiving the notification
    private String senderId;    // ID of the user who triggered the notification
    private String senderUsername;
    private String senderProfilePicture;
    
    private String type;        // FOLLOW, LIKE, COMMENT, etc.
    private String message;     // Human-readable notification message
    private String resourceId;  // ID of related resource (post, comment, etc.)
    
    private boolean read;       // Whether the notification has been read
    private LocalDateTime createdAt;
}
