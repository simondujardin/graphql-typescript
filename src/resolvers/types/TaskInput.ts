import { Field, ID, InputType } from "type-graphql";
import { ObjectId } from "mongodb";

@InputType()
export class TaskCreateInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  projectName?: string;

  @Field({ defaultValue: false })
  completed?: boolean;
}

@InputType()
export class TaskUpdateInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  projectName?: string;

  @Field({ nullable: true })
  completed?: boolean;
}
