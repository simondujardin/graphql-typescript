import {
  Arg,
  FieldResolver,
  Query,
  Mutation,
  Resolver,
  Root
} from "type-graphql";
import { Project, ProjectModel } from "../entities/Project";
import { Task, TaskModel } from "../entities/Task";
import { ProjectCreateInput, ProjectUpdateInput } from "./types/ProjectInput";

@Resolver(of => Project)
export default class {

  @Query(returns => Project, { nullable: true })
  async project(@Arg("name") name: string): Promise<Project> {
    return (await ProjectModel.findOne({ name: name }))!;
  }

  @Query(returns => [Project])
  async projects(): Promise<Project[]> {
    return (await ProjectModel.find({}))!;
  }

  @Mutation(returns => Project)
  async createProject(
    @Arg("projectInput") projectInput: ProjectCreateInput
  ): Promise<Project> {
    return await ProjectModel.create(projectInput);
  }

  @Mutation(returns => Project)
  async updateProject(@Arg("name") name: String, @Arg("projectInput") projectInput: ProjectUpdateInput): Promise<Project> {
    const toUpdateProject = (await ProjectModel.findOne({ name }))!;
    let project = undefined;
    if (projectInput.name !== undefined) {
      toUpdateProject.name = projectInput.name;
    }
    return await toUpdateProject.save();
  }

  @Mutation(returns => Boolean)
  async deleteProject(
    @Arg("name") name: String
  ) {
    const result = await ProjectModel.deleteOne({ name })
    if (result.ok === 1) {
      return true
    }
    return false;
  }

  @FieldResolver()
  async tasks(@Root() projectData: Project): Promise<Task[]> {
    return await TaskModel.find({ project_id: projectData._id });
  }
}
