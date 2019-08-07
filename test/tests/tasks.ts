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

  it("createTask", async () => {
    const mutation = `
    mutation{
      createTask(taskInput:{title:"Test",projectName:"Test",completed:true}){
        title
        project{
          name
        }
      }
    }
    `;
    const result = await graphql(schema, mutation);
    expect(result.data).not.toBeUndefined();
    expect(result.data).not.toBeNull();
    if (result.data !== undefined) {
      expect(result.data.createTask.title).toBe("Test");
      expect(result.data.createTask.project.name).toBe("Test");
    }
  });

  it("tasks", async () => {
    const query = `
    {
      tasks {
        title
        project{
          name
        }
      }
    }
    `;
    const result = await graphql(schema, query);
    expect(result.data).not.toBeUndefined();
    expect(result.data).not.toBeNull();
    if (result.data !== undefined) {
      expect(result.data.tasks[0].title).toBe("Test");
      expect(result.data.tasks[0].project.name).toEqual("Test");
      expect(result.data.tasks[1]).toBeUndefined();
    }
  });

  it("task", async () => {
    const query = `
    {
      task(title:"Test") {
        title
        project{
          name
        }
      }
    }
    `;
    const result = await graphql(schema, query);
    expect(result.data).not.toBeUndefined();
    expect(result.data).not.toBeNull();
    if (result.data !== undefined) {
      expect(result.data.task.title).toBe("Test");
      expect(result.data.task.project.name).toBe("Test");
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
      expect(result.data.project.tasks[0].title).toBe("Test");
    }
  });

  it("updateTask", async () => {
    const mutation = `
    mutation{
      updateTask(title:"Test",taskInput:{title:"Updated-Test"}){
        title
      }
    }
    `;
    const result = await graphql(schema, mutation);
    expect(result.data).not.toBeUndefined();
    expect(result.data).not.toBeNull();
    if (result.data !== undefined)
      expect(result.data.updateTask.title).toBe("Updated-Test");
  });

  it("removeProject", async () => {
    const mutation = `
    mutation{
      deleteTask(title:"Updated-Test")
    }
    `;
    const result = await graphql(schema, mutation);
    expect(result.data).not.toBeUndefined();
    expect(result.data).not.toBeNull();
    if (result.data !== undefined)
      expect(result.data.deleteTask).toBe(true);
  });
};
