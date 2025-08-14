"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserFormModal } from "../components/user-form-modal";
import { createUser } from "@/api/user.api";
import type { CreateUserDto, UpdateUserDto } from "@/types/user";
import { Plus } from "lucide-react";

interface UserCreateButtonProps {
  onUserCreated?: () => void;
}

export const UserCreateButton: React.FC<UserCreateButtonProps> = ({ onUserCreated }) => {
  const [open, setOpen] = useState(false);

  const handleCreate = async (data: CreateUserDto | UpdateUserDto) => {
    await createUser(data as CreateUserDto);
    setOpen(false);
    onUserCreated?.();
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} >
        <Plus className="h-4 w-4" />
        Crear usuario
      </Button>
      <UserFormModal open={open} onOpenChange={setOpen} onSubmit={handleCreate} />
    </>
  );
};
