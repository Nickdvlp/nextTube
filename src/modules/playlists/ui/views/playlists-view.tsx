"use client";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { PlaylistCreateModal } from "../components/playlist-create-modal";
import PlaylistSection from "../sections/playlist-section";

const PlaylistsView = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  return (
    <div className="md:w-[80vw] w-2xl px-4 pt-2.5 flex flex-col gap-y-6">
      <PlaylistCreateModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Playlists</h1>
          <p className="text-xs text-muted-foreground">
            Playlists you have created
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => setCreateModalOpen(true)}
        >
          <PlusIcon />
        </Button>
      </div>
      <PlaylistSection />
    </div>
  );
};

export default PlaylistsView;
