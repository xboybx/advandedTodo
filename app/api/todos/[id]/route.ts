import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Todo from '@/models/Todo';

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const body = await req.json();
        const { id } = params;

        const updatedTodo = await Todo.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!updatedTodo) {
            return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
        }

        return NextResponse.json(updatedTodo);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const { id } = params;

        const deletedTodo = await Todo.findByIdAndDelete(id);

        if (!deletedTodo) {
            return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
    }
}
