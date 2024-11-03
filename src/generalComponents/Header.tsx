// src/components/Header.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { getInitials } from '@/utils/utils';
import { User } from '@/types/reduxTypes';
import { DropdownMenuLabel, DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';
import { logoutUser } from '@/slices/authSlice';

interface RootState {
    auth: {
        user: User | null;
    };
}

const Header: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { user } = useAppSelector((state: RootState) => state.auth);


    // Logout handler
    const handleLogout = () => {
        // Clear any authentication data and navigate to login
        dispatch(logoutUser())
        navigate('/login');
    };

    return (
        <header className="flex justify-between items-center p-4 shadow-md bg-white">
            <div className="text-2xl font-bold text-primary cursor-pointer">
                Kanban
            </div>

            <div className="flex items-center space-x-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="w-10 h-10 flex cursor-pointer rounded-full">
                            <AvatarFallback className='w-10 h-10 justify-center align-middle flex rounded-full text-black border border-black p-2 text-md'>
                                {getInitials(user && user.firstName || "John", user && user.lastName || "Doe")}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel className='p-2'>{`Hello ${user?.firstName} ${user?.lastName}`}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className='cursor-pointer' onClick={handleLogout}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default Header;
