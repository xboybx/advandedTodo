import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Todo from '@/models/Todo';

export async function GET() {
    try {
        await dbConnect();
        const todos = await Todo.find({}).sort({ createdAt: -1 });
        return NextResponse.json(todos);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const todo = await Todo.create(body);
        return NextResponse.json(todo, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
    }
}
