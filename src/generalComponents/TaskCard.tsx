import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Tag, Edit, Trash } from "lucide-react";
import { Priority, Task } from "@/types/boardTypes";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { getInitials } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { User } from "@/types/reduxTypes";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import EditTaskDialog from "./EditTaskDialog";
import { deleteTask } from "@/APIs/boardApis";

interface TaskCardProps {
    task: Task;
    user: User | null;
    onTaskUpdate: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, user, onTaskUpdate }) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Function to get the color based on task priority
    const getPriorityColor = (priority: Priority): string => {
        switch (priority) {
            case Priority.HIGH:
                return 'bg-red-500';
            case Priority.MEDIUM:
                return 'bg-yellow-500';
            case Priority.LOW:
                return 'bg-green-500';
            default:
                return 'bg-gray-500';
        }
    };

    const isOwner = user?._id === task.ownerId;

    const handleDelete = async () => {
        try {
            const response = await deleteTask(task._id);
            if (response.success) {
                toast.success("Task deleted successfully");
                onTaskUpdate();
            } else {
                toast.error("Failed to delete task");
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            toast.error("An error occurred while deleting the task");
        }
        setIsDeleteOpen(false);
    };

    return (
        <>
            <Card className="mb-2">
                <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-sm">{task.title}</h3>
                        <Badge variant="destructive" className={`${getPriorityColor(task.priority)} text-white`}>
                            {task.priority}
                        </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                        {task.labels.map((label, index) => (
                            <Badge key={index} variant="secondary" className="text-xs flex items-center">
                                <Tag className="w-3 h-3 mr-1" />
                                {label}
                            </Badge>
                        ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            {new Date(task.createdAt).toLocaleDateString()}
                        </div>
                        {task.dueDate && (
                            <div className="flex items-center gap-2">
                                <Calendar className="w-3 h-3" />
                                {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                        )}
                    </div>
                    {task.assigneeId && (
                        <div className="mt-2 flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                                <AvatarFallback>
                                    {getInitials(task.assigneeId.firstName, task.assigneeId.lastName)}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-600">Assigned</span>
                        </div>
                    )}
                    {isOwner && (
                        <div className="mt-2 flex gap-2 justify-end">
                            <Button
                                variant="secondary"
                                onClick={() => setIsEditOpen(true)}
                                className="flex items-center gap-1 text-xs"
                            >
                                <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => setIsDeleteOpen(true)}
                                className="flex items-center gap-1 text-xs"
                            >
                                <Trash className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <EditTaskDialog
                task={task}
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                onTaskUpdate={onTaskUpdate}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the task "{task.title}". This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default TaskCard;