import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Priority, Task, UpdateTaskRequest } from "@/types/boardTypes";
import { User } from "@/types/reduxTypes";
import { getAllUsers, updateTask } from "@/APIs/boardApis";
import { toast } from "sonner";

interface EditTaskDialogProps {
    task: Task;
    isOpen: boolean;
    onClose: () => void;
    onTaskUpdate: () => void;
}

const EditTaskDialog: React.FC<EditTaskDialogProps> = ({ task, isOpen, onClose, onTaskUpdate }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        title: task.title,
        description: task.description,
        priority: task.priority,
        assigneeId: task.assigneeId?._id || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        labels: task.labels.join(', '),
        status: task.status
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response: any = await getAllUsers();
                if (response.success) {
                    setUsers(response.data.users);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updatedTask: UpdateTaskRequest | any = {
                ...form,
                labels: form.labels.split(',').map(label => label.trim()),
                taskId: task._id
            };

            const response = await updateTask(updatedTask);
            if (response.success) {
                toast.success("Task updated successfully");
                onTaskUpdate();
                onClose();
                setError(null);
            } else {
                setError('Failed to update task. Please try again.');
            }
        } catch (error) {
            console.error('Error updating task:', error);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="text-red-500">{error}</div>}
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                            value={form.priority}
                            onValueChange={(value) => setForm({ ...form, priority: value as Priority })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(Priority).map(priority => (
                                    <SelectItem key={priority} value={priority}>
                                        {priority}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="assignee">Assignee</Label>
                        <Select
                            value={form.assigneeId}
                            onValueChange={(value) => setForm({ ...form, assigneeId: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select assignee" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map(user => (
                                    <SelectItem key={user._id} value={user._id}>
                                        {user.firstName} {user.lastName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                            id="dueDate"
                            type="date"
                            value={form.dueDate}
                            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="labels">Labels (comma-separated)</Label>
                        <Input
                            id="labels"
                            value={form.labels}
                            onChange={(e) => setForm({ ...form, labels: e.target.value })}
                            placeholder="bug, feature, urgent"
                        />
                    </div>
                    <Button type="submit" className="w-full">Update Task</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditTaskDialog;