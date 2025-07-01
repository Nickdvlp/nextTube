import { commentsInsertSchema } from "@/app/db/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";
import { trpc } from "@/trpc/client";
import { useClerk, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface CommentFormProps {
  videoId: string;
  parentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  variant?: "comment" | "reply";
}

const CommentForm = ({
  videoId,
  parentId,
  onSuccess,
  onCancel,
  variant = "comment",
}: CommentFormProps) => {
  const { user } = useUser();
  const utils = trpc.useUtils();
  const clerk = useClerk();
  const create = trpc.comments.create.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId });
      form.reset();
      toast.success("Comment created successfully!");
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Error creating comment:", error);
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });

  const schemaWithoutUserId = commentsInsertSchema.omit({ userId: true });

  const form = useForm<z.infer<typeof schemaWithoutUserId>>({
    resolver: zodResolver(schemaWithoutUserId),
    defaultValues: {
      parentId: parentId,
      videoId: videoId,
      value: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof schemaWithoutUserId>) => {
    create.mutate(values);
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };
  return (
    <Form {...form}>
      <form
        className="flex gap-4 group"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <UserAvatar
          size="lg"
          imageUrl={user?.imageUrl || "/userdummy.svg"}
          name={user?.username || "User"}
          className="bg-gray-200 border"
        />

        <div className="flex-1">
          <FormField
            name="value"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={
                      variant === "reply"
                        ? "Reply to this comment..."
                        : "Add a comment..."
                    }
                    className="resize-none bg-transparent overflow-hidden min-h-0"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="justify-end gap-2 mt-2 flex">
            {onCancel && (
              <Button variant="ghost" type="button" onClick={handleCancel}>
                Cancel
              </Button>
            )}
            <Button
              disabled={create.isPending}
              type="submit"
              size="sm"
              variant="default"
            >
              {variant === "reply" ? "Reply" : "Comment"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CommentForm;
