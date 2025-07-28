"use client";

import { EditorProvider } from "@tiptap/react";
import { LoaderButton } from "@/components/loader-button";
import { updateProfileBioAction } from "../actions";
import { useRef } from "react";
import { useAction } from "next-safe-action/hooks";
import { MenuBar } from "./menu-bar";
import { toast } from "sonner";
import { extensions } from "./extensions";

export function EditBioForm({ bio }: { bio: string }) {
  const { execute, isPending } = useAction(updateProfileBioAction, {
    onSuccess: () => {
      toast.success("Profile bio updated");
    },
    onError: ({ error }) => {
      toast.error("Failed to update profile bio", {
        description:
          error.serverError?.message || "Failed to update profile bio",
      });
    },
  });
  const htmlRef = useRef<string>(bio);

  return (
    <div className="w-full space-y-4">
      <EditorProvider
        onUpdate={({ editor }) => {
          htmlRef.current = editor.getHTML();
        }}
        slotBefore={<MenuBar />}
        extensions={extensions}
        content={bio}
        editable={true}
        editorProps={{
          attributes: {
            class: "prose dark:prose-invert max-w-none",
          },
        }}
        immediatelyRender={false}
      ></EditorProvider>

      <div className="flex justify-end">
        <LoaderButton
          onClick={() => {
            execute({ bio: htmlRef.current });
          }}
          isLoading={isPending}
          className="self-end"
        >
          Save Changes
        </LoaderButton>
      </div>
    </div>
  );
}
