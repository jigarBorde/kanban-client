import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Tag } from "lucide-react";
import { Priority, Task } from "@/types/boardTypes";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { getInitials } from "@/utils/utils";

interface TaskCardProps {
    task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {


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

    return (
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
                            <AvatarFallback>{getInitials(task.assigneeId.firstName, task.assigneeId.lastName)}</AvatarFallback>

                        </Avatar>
                        <span className="text-xs text-gray-600">Assigned</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default TaskCard