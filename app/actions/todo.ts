"use server";

import dbConnect from "@/lib/db";
import Todo, { ITodo } from "@/models/Todo";
import { Todo as TodoType, Priority } from "@/types/todo";
import { revalidatePath } from "next/cache";

// Helper to serialize Mongoose document to plain object
function serializeTodo(doc: any): TodoType {
    return {
        id: doc._id.toString(),
        title: doc.title,
        description: doc.description || "",
        notes: doc.notes || "",
        priority: doc.priority,
        completed: doc.completed,
        dueDate: doc.dueDate ? new Date(doc.dueDate) : null,
        createdAt: new Date(doc.createdAt),
        updatedAt: new Date(doc.updatedAt),
    };
}

export async function getTodos(): Promise<TodoType[]> {
    await dbConnect();
    try {
        const todos = await Todo.find({}).sort({ createdAt: -1 });
        return todos.map(serializeTodo);
    } catch (error) {
        console.error("Failed to fetch todos:", error);
        return [];
    }
}

export async function createTodo(
    title: string,
    description: string,
    priority: Priority,
    dueDate: Date | null,
    notes: string = ""
): Promise<TodoType> {
    await dbConnect();
    try {
        const newTodo = await Todo.create({
            title,
            description,
            priority,
            dueDate,
            notes,
            completed: false,
        });
        revalidatePath("/");
        return serializeTodo(newTodo);
    } catch (error) {
        console.error("Failed to create todo:", error);
        throw new Error("Failed to create todo");
    }
}

export async function updateTodo(
    id: string,
    updates: Partial<TodoType>
): Promise<TodoType> {
    await dbConnect();
    try {
        // Convert id to _id for Mongoose if necessary, but findByIdAndUpdate handles string id if it matches ObjectId format
        // Map 'id' in updates to undefined to avoid trying to update immutable _id field if it blindly passes it
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _, ...updateData } = updates;

        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { ...updateData },
            { new: true, runValidators: true }
        );

        if (!updatedTodo) {
            throw new Error("Todo not found");
        }

        revalidatePath("/");
        return serializeTodo(updatedTodo);
    } catch (error) {
        console.error("Failed to update todo:", error);
        throw new Error("Failed to update todo");
    }
}

export async function deleteTodo(id: string): Promise<void> {
    await dbConnect();
    try {
        await Todo.findByIdAndDelete(id);
        revalidatePath("/");
    } catch (error) {
        console.error("Failed to delete todo:", error);
        throw new Error("Failed to delete todo");
    }
}
