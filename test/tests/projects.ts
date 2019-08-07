import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { graphql, GraphQLSchema } from "graphql";
import ProjectResolver from "../../src/resolvers/ProjectResolver";
import TaskResolver from "../../src/resolvers/TaskResolver";
import { ObjectId } from "mongodb";
import { ObjectIdScalar } from "../../src/object-id.scalar";

export function suite() {
  let schema: GraphQLSchema

  beforeAll(async () => {
    schema = await buildSchema({
      resolvers: [ProjectResolver, TaskResolver],
      emitSchemaFile: true,
      scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }]
    });
  })

  it("createProject", async () => {
    const mutation = `
    mutation{
      createProject(projectInput:{name:"Test"}){
        name
      }
    }
    `;
    const result = await graphql(schema, mutation);
    expect(result.data).not.toBeUndefined();
    expect(result.data).not.toBeNull();
    if (result.data !== undefined)
      expect(result.data.createProject.name).toBe("Test");
  });

  it("projects", async () => {
    const query = `
    {
      projects {
        name
        tasks {
          title
        }
      }
    }
    `;
    const result = await graphql(schema, query);
    expect(result.data).not.toBeUndefined();
    expect(result.data).not.toBeNull();
    if (result.data !== undefined) {
      expect(result.data.projects[0].name).toBe("Test");
      expect(result.data.projects[0].tasks).toEqual([]);
      expect(result.data.projects[1]).toBeUndefined();
    }
  });

  it("project", async () => {
    const query = `
    {
      project(name:"Test") {
        name
        tasks {
          title
        }
      }
    }
    `;
    const result = await graphql(schema, query);
    expect(result.data).not.toBeUndefined();
    expect(result.data).not.toBeNull();
    if (result.data !== undefined) {
      expect(result.data.project.name).toBe("Test");
      expect(result.data.project.tasks).toEqual([]);
    }
  });

  it("updateProject", async () => {
    const mutation = `
    mutation{
      updateProject(name:"Test",projectInput:{name:"Updated-Test"}){
        name
      }
    }
    `;
    const result = await graphql(schema, mutation);
    expect(result.data).not.toBeUndefined();
    expect(result.data).not.toBeNull();
    if (result.data !== undefined)
      expect(result.data.updateProject.name).toBe("Updated-Test");
  });

  it("removeProject", async () => {
    const mutation = `
    mutation{
      deleteProject(name:"Updated-Test")
    }
    `;
    const result = await graphql(schema, mutation);
    expect(result.data).not.toBeUndefined();
    expect(result.data).not.toBeNull();
    if (result.data !== undefined)
      expect(result.data.deleteProject).toBe(true);
  });
};
