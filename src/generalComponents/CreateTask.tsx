import React, { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Priority, TaskStatus, CreateTaskForm } from "@/types/boardTypes";
import { User } from "@/types/reduxTypes";
import { createTask, getAllUsers } from "@/APIs/boardApis";
import { toast } from "sonner";

interface CreateTaskDialogProps {
    onTaskCreate: () => void;
}

const CreateTask: React.FC<CreateTaskDialogProps> = ({ onTaskCreate }) => {
    const [form, setForm] = useState<CreateTaskForm>({ title: '', description: '', priority: Priority.LOW, assigneeId: '', dueDate: '', labels: '', status: TaskStatus.OPEN });
    const [users, setUsers] = useState<User[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response: any = await getAllUsers();

                if (response.success) {
                    const data = await response.data.users;
                    setUsers(data);
                } else {
                    // Log the error for debugging
                    console.error("Error fetching users:", response.error?.message);
                }

            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.description) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            const updatedForm: any = { ...form, labels: form.labels.split(',').map(label => label.trim()) };
            const response: any = await createTask(updatedForm);
            if (response.success) {
                toast.success("New task created successfully");
                onTaskCreate();
                setForm({ title: '', description: '', priority: Priority.LOW, assigneeId: '', dueDate: '', labels: '', status: TaskStatus.OPEN });
                setIsOpen(false);
                setError(null);
            } else {
                setError('Failed to create task. Please try again.');
            }
        } catch (error) {
            console.error('Error creating task:', error);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="ml-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Task
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader><DialogTitle>Create New Task</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="text-red-500">{error}</div>}
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                    </div>
                    <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={form.priority} onValueChange={(value) => setForm({ ...form, priority: value as Priority })}>
                            <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                            <SelectContent>
                                {Object.values(Priority).map(priority => (
                                    <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="assignee">Assignee</Label>
                        <Select value={form.assigneeId || ""} onValueChange={(value) => setForm({ ...form, assigneeId: value })}>
                            <SelectTrigger><SelectValue placeholder="Select assignee" /></SelectTrigger>
                            <SelectContent>
                                {users.map(user => (
                                    <SelectItem key={user._id} value={user._id}>{user.firstName} {user.lastName}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input id="dueDate" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
                    </div>
                    <div>
                        <Label htmlFor="labels">Labels (comma-separated)</Label>
                        <Input id="labels" value={form.labels} onChange={(e) => setForm({ ...form, labels: e.target.value })} placeholder="bug, feature, urgent" />
                    </div>
                    <Button type="submit" className="w-full">Create Task</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateTask;
