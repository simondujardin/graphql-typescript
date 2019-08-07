import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root
} from "type-graphql";
import { Task, TaskModel, TaskData } from "../entities/Task";
import { Project, ProjectModel } from "../entities/Project";
import { TaskCreateInput, TaskUpdateInput } from "./types/TaskInput";

@Resolver(of => Task)
export default class {
  @Query(returns => [Task])
  async tasks(): Promise<Task[]> {
    return await TaskModel.find({});
  }

  @Query(returns => Task, { nullable: true })
  async task(@Arg("title") title: String): Promise<Task> {
    return (await TaskModel.findOne({ title }))!;
  }

  @Mutation(returns => Task)
  async createTask(@Arg("taskInput") taskInput: TaskCreateInput): Promise<Task> {
    let project = undefined;
    if (taskInput.projectName !== undefined) {
      project = await ProjectModel.findOne({ name: taskInput.projectName });
      if (!project) {
        throw new Error("Invalid project name");
      }
    }
    let projectId = project ? project._id : undefined;
    const task = new TaskModel({ title: taskInput.title, completed: taskInput.completed, project: projectId })
    return await task.save();
  }

  @Mutation(returns => Task)
  async updateTask(@Arg("title") title: String, @Arg("taskInput") taskInput: TaskUpdateInput): Promise<Task> {
    const toUpdateTask = (await TaskModel.findOne({ title }))!;
    let project = undefined;
    if (taskInput.projectName !== undefined) {
      project = await ProjectModel.findOne({ name: taskInput.projectName });
      if (!project) {
        throw new Error("Invalid project name");
      }
      toUpdateTask.project = project._id;
    }
    if (taskInput.completed !== undefined) {
      toUpdateTask.completed = taskInput.completed;
    }
    if (taskInput.title !== undefined) {
      toUpdateTask.title = taskInput.title;
    }
    return await toUpdateTask.save();
  }

  @Mutation(returns => Boolean)
  async deleteTask(
    @Arg("title") title: String
  ) {
    const result = await TaskModel.deleteOne({ title });
    if (result.ok === 1) {
      return true
    }
    return false
  }

  @FieldResolver()
  async project(@Root() task: TaskData): Promise<Project> {
    return (await ProjectModel.findById(task.project))!;
  }
}
