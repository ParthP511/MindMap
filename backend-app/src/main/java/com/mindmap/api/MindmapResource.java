package com.mindmap.api;

import com.mindmap.dto.MindmapNodeDTO;
import com.mindmap.model.MindmapNode;
import com.mongodb.client.MongoClient;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;
import com.mongodb.client.result.UpdateResult;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.bson.conversions.Bson;
import org.bson.types.ObjectId;


@Path("/api/nodes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MindmapResource {

    @Inject
    MongoClient mongoClient;

    @GET
    public List<MindmapNodeDTO> getAllNodes() {
        return MindmapNode.<MindmapNode>listAll().stream()
                .map(node -> new MindmapNodeDTO(
                    node.id != null ? node.id.toString() : null,
                    node.title,
                    node.content,
                    node.parentId != null ? node.parentId.toString() : null
                ))
                .collect(Collectors.toList());
    }

    @POST
    public Response createNode(MindmapNodeDTO dto) {
        System.out.println(">>>>>> RECEIVED: " + dto.title + " / " + dto.parentId);
        MindmapNode node = new MindmapNode();
        node.title = dto.title;
        node.content = dto.content;
        node.parentId = (dto.parentId != null && !dto.parentId.isEmpty())
                        ? new ObjectId(dto.parentId) : null;
        node.persist();
        return Response.status(Response.Status.CREATED).entity(node).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deleteNode(@PathParam("id") String id) {
        MindmapNode node = MindmapNode.findById(new ObjectId(id));

        if(node == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        System.out.println("In API Method for delete!!!");

        node.delete();
        return Response.noContent().build();
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateNode(@PathParam("id") String id, MindmapNodeDTO dto) {
        Bson filter = Filters.eq("_id", new ObjectId(id));
        Bson updates = Updates.combine(Updates.set("title", dto.title),
        Updates.set("content", dto.content)
        );

        UpdateResult result = mongoClient
                                .getDatabase("mindmapdb")
                                .getCollection("mindmap_nodes")
                                .updateOne(filter, updates);
        
                                return result.getModifiedCount() > 0
                                        ? Response.noContent().build()
                                        : Response.status(Response.Status.NOT_FOUND).build();
    }

    @PUT
    @Path("/{id}/move")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response moveNode(@PathParam("id") String id, Map<String, String> request) {
        Bson filter = Filters.eq("_id", new ObjectId(id));

        Object parentIdRaw = request.get("parentId");
        Bson update;

        if(parentIdRaw == null || parentIdRaw.toString().equals("null")) {
            update = Updates.unset("parentId");
        } else {
            try {
                ObjectId newParentId = new ObjectId(parentIdRaw.toString());
                update = Updates.set("parentId", newParentId);
            } catch (IllegalArgumentException e) {
                return Response.status(Response.Status.BAD_REQUEST)
                            .entity("Invalid parentId: must be a valid ObjectId string").build();
            }
        }

        UpdateResult result = mongoClient.getDatabase("mindmapdb")
                                            .getCollection("mindmap_nodes")
                                            .updateOne(filter, update);
        
        return result.getModifiedCount() > 0 ? Response.noContent().build()
                                                : Response.status(Response.Status.NOT_FOUND).build();
    }
}
