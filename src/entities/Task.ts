import { Field, ObjectType } from "type-graphql";
import { Typegoose, prop as Property, Ref } from "typegoose";
import { ObjectId } from "mongodb";
import { Project } from "./Project";

export interface TaskData {
  title: string;
  completed: boolean;
  project: number;
}

@ObjectType()
export class Task extends Typegoose {
  @Field()
  readonly _id: ObjectId;

  @Field()
  @Property({ required: true })
  title: string;

  @Field(type => Project, { nullable: true })
  @Property({ ref: Project, required: false })
  project: Ref<Project>;

  @Field()
  @Property({ default: false })
  completed: boolean;
}

export const TaskModel = new Task().getModelForClass(Task);
