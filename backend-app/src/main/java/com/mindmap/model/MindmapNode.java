package com.mindmap.model;

import org.bson.types.ObjectId;
import io.quarkus.mongodb.panache.common.MongoEntity;
import io.quarkus.mongodb.panache.PanacheMongoEntity;

@MongoEntity(collection = "mindmap_nodes")
public class MindmapNode extends PanacheMongoEntity{
    public String title;
    public String content;
    public ObjectId parentId;

    public MindmapNode() {}

    public MindmapNode(String title, String content, ObjectId parentId) {
        this.title = title;
        this.content = content;
        this.parentId = parentId;
    }
}
