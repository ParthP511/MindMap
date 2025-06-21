package com.mindmap.dto;

public class MindmapNodeDTO {
    public String id;
    public String title;
    public String content;
    public String parentId;

    public MindmapNodeDTO(String id, String title, String content, String parentId) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.parentId = parentId;
    }
}
