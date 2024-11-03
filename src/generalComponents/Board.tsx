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
        await fetchTasks();
    };

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
                return null;
            } else {
                return "Only the task owner can mark the task as complete.";
            }
        } else {
            if (task.ownerId === user._id || task.assigneeId?._id === user._id) {
                return null;
            } else {
                return "You are not assigned to this task, so you cannot move it.";
            }
        }
    };

    const onDragEnd = async (result: any) => {
        const { destination, source, draggableId } = result;
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;

        const task = columns[source.droppableId].tasks.find(t => t._id === draggableId);
        if (!task) return;

        const errorMessage = canMoveTask(task, destination.droppableId as TaskStatus);

        if (errorMessage) {
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
        fetchTasks();
    }, []);

    return (
        <div className="p-2 sm:p-4 md:p-6">
            <div className='flex px-2 sm:px-5 pb-3 sm:pb-5'>
                <CreateTask onTaskCreate={handleTaskCreate} />
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                    {Object.values(columns).map(column => (
                        <div key={column.id} className="bg-gray-50 rounded-lg p-2 sm:p-4">
                            <h2 className="font-semibold mb-2 sm:mb-4 text-sm sm:text-base">
                                {column.title}
                                <span className="ml-2 text-gray-500 text-xs sm:text-sm">
                                    ({column.tasks.length})
                                </span>
                            </h2>
                            <Droppable droppableId={column.id}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="min-h-[200px] sm:min-h-[300px] lg:min-h-[500px] transition-all duration-300"
                                    >
                                        {column.tasks.map((task, index) => (
                                            <Draggable key={task._id} draggableId={task._id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="p-2 bg-white border rounded mb-2 shadow-sm hover:shadow-md transition-shadow duration-200"
                                                    >
                                                        <TaskCard
                                                            task={task}
                                                            user={user}
                                                            onTaskUpdate={fetchTasks}
                                                        />
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