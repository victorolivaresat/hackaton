"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PermissionFormModal } from "./permission-form-modal";
import { createPermission } from "@/api/permission.api";
import type { CreatePermissionDto, Permission } from "@/types/permission";
import { Plus } from "lucide-react";

interface PermissionCreateButtonProps {
  onPermissionCreated?: () => void;
}

export const PermissionCreateButton: React.FC<PermissionCreateButtonProps> = ({ onPermissionCreated }) => {
  const [open, setOpen] = useState(false);

  const handleCreate = async (data: Partial<Permission>) => {
    // Convertir Permission a CreatePermissionDto
    const createData: CreatePermissionDto = {
      name: data.name!,
      description: data.description,
      moduleId: data.module?.id || 0,
    };
    await createPermission(createData);
    setOpen(false);
    onPermissionCreated?.();
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Crear permiso
      </Button>
      <PermissionFormModal open={open} onOpenChange={setOpen} onSubmit={handleCreate} />
    </>
  );
};
