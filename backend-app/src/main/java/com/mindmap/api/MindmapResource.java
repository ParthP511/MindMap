package com.mindmap.api;

import com.mindmap.dto.MindmapNodeDTO;
import com.mindmap.model.MindmapNode;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;


@Path("/api/nodes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MindmapResource {

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
}
