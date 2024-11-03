import { useAppSelector } from '@/hooks/redux';
import { Task, TaskStatus, Column } from '@/types/boardTypes';
import { User } from '@/types/reduxTypes';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import React, { useEffect, useState } from 'react';
import TaskCard from './TaskCard';
import CreateTask from './CreateTask';
import { getAllTasks, updateTaskStatus } from '@/APIs/boardApis';
import { toast } from "sonner"



const Board: React.FC = () => {
    interface RootState {
        auth: { user: User | null };
    }

    const { user } = useAppSelector((state: RootState) => state.auth);

    const handleTaskCreate = async () => {
        await fetchTasks(); // Refresh tasks after a new one is created
    };

    // Fetch tasks from backend
    const fetchTasks = async () => {
        try {
            const response = await getAllTasks();

            if (response.success) {
                const tasks = response.data?.tasks || [];
                const newColumns = { ...columns };
                Object.values(TaskStatus).forEach(status => {
                    newColumns[status].tasks = tasks.filter((task: Task) => task.status === status);
                });
                setColumns(newColumns);
                toast.success("Data Updated")

            } else {
                // Log the error for debugging
                console.error("Error fetching tasks:", response.error?.message);
            }
        } catch (error) {
            console.error("Unexpected error:", error);
        }
    };


    const [columns, setColumns] = useState<{ [key: string]: Column }>({
        [TaskStatus.OPEN]: { id: TaskStatus.OPEN, title: 'Open', tasks: [] },
        [TaskStatus.IN_PROGRESS]: { id: TaskStatus.IN_PROGRESS, title: 'In Progress', tasks: [] },
        [TaskStatus.REVIEW]: { id: TaskStatus.REVIEW, title: 'Review', tasks: [] },
        [TaskStatus.DONE]: { id: TaskStatus.DONE, title: 'Done', tasks: [] }
    });

    const canMoveTask = (task: Task, newStatus: TaskStatus): string | null => {
        if (!user) return "User is not logged in.";

        if (newStatus === TaskStatus.DONE) {
            if (task.ownerId === user._id) {
                return null; // Owner can move the task to done
            } else {
                return "Only the task owner can mark the task as complete.";
            }
        } else {
            if (task.ownerId === user._id || task.assigneeId?._id === user._id) {
                return null; // Owner or assignee can move the task
            } else {
                return "You are not assigned to this task, so you cannot move it.";
            }
        }
    };

    const onDragEnd = async (result: any) => {
        const { destination, source, draggableId } = result;
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;
        const task = columns[source.droppableId].tasks.find(t => t._id === draggableId);
        // if (!task || !canMoveTask(task, destination.droppableId as TaskStatus)) {

        //     toast.error("Only the task owner is permitted to mark the task as complete.")
        //     return;
        // }
        const errorMessage = canMoveTask(task, destination.droppableId as TaskStatus);

        if (!task || errorMessage) {
            toast.error(errorMessage);
            return;
        }

        const newColumns = { ...columns };
        newColumns[source.droppableId].tasks.splice(source.index, 1);
        newColumns[destination.droppableId].tasks.splice(destination.index, 0, { ...task, status: destination.droppableId as TaskStatus });
        setColumns(newColumns);

        try {
            await updateTaskStatus({ taskId: task._id, status: destination.droppableId, lastModifiedBy: user?._id || '' });
            toast.success("Data Updated")
        } catch (error) {
            console.error('Error updating task:', error);
            setColumns(columns);
        }
    };

    useEffect(() => {
        // get all tasks
        fetchTasks();
    }, []);

    return (
        <div className="p-6">
            <div className='flex px-5 pb-5'>
                <CreateTask onTaskCreate={handleTaskCreate} />
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-4 gap-4">
                    {Object.values(columns).map(column => (
                        <div key={column.id} className="bg-gray-50 rounded-lg p-4">
                            <h2 className="font-semibold mb-4">{column.title}</h2>
                            <Droppable droppableId={column.id}>
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps} className="min-h-[500px]">
                                        {column.tasks.map((task, index) => (
                                            <Draggable key={task._id} draggableId={task._id} index={index}>
                                                {(provided) => (
                                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="p-2 bg-white border rounded mb-2">
                                                        <TaskCard task={task} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};

export default Board;
