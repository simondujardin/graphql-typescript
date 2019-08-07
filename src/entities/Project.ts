import { Field, ObjectType } from "type-graphql";
import {
  Typegoose,
  prop as Property,
  arrayProp as ArrayProperty
} from "typegoose";
import { ObjectId } from "mongodb";
import { Task } from "./Task";

@ObjectType()
export class Project extends Typegoose {
  @Field(type => String)
  readonly _id: ObjectId;

  @Field()
  @Property({ required: true })
  name: string;

  @Field(type => [Task])
  @ArrayProperty({ items: Task, default: [] })
  tasks: Task[];
}

export const ProjectModel = new Project().getModelForClass(Project);
