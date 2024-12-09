import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import MailController from "@/api/controllers/MailController";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { Pencil, X, Reply } from "lucide-react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { sendEmailSchema } from "@/types/api/sendEmail";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Mail } from "@/types/mail";

interface SendDialogProps {
  replyTo?: Mail;
}

export function SendDialog({ replyTo }: SendDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
         {
          replyTo ? <Reply size={16} /> : <Pencil size={16} />
         }
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Email</DialogTitle>
        </DialogHeader>

        <SendForm setDialogOpen={setIsOpen} replyTo={replyTo} />

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SendForm({
  setDialogOpen,
  replyTo,
}: {
  setDialogOpen?: (open: boolean) => void;
  replyTo?: Mail;
}) {
  const form = useForm<z.infer<typeof sendEmailSchema>>({
    resolver: zodResolver(sendEmailSchema),
    defaultValues: {
      emails: replyTo ? [replyTo.from] : [],
      subject: replyTo ? `Re: ${replyTo.subject}` : "",
      body: replyTo ? `\n
\n
On ${replyTo.date}, ${replyTo.from} wrote:
${replyTo.text}
`
        : "",
    },
  });

  const sendEmail = useMutation({
    mutationFn: MailController.sendEmail,
    onMutate: () => {
      toast.info("Sending email...");
    },
    onSuccess: () => {
      toast.success("Email sent");
    },
  });

  const onSubmit = (data: z.infer<typeof sendEmailSchema>) => {
    sendEmail.mutate({
      ...data,
      reply_to: replyTo?.from,
    });
    setDialogOpen?.(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="subject">Subject</FormLabel>
              <FormControl>
                <Input id="subject" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={form.control}
          name="emails"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="to">To</FormLabel>
              <FormControl>
                <MultiValueInput externalForm={form} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="body">Body</FormLabel>
              <FormControl>
                <Textarea
                  id="body"
                  {...field}
                  rows={10}
                  placeholder="Type your message here"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>

        <Button type="submit">Send</Button>
      </form>
    </Form>
  );
}

const multiSchema = z.object({
  value: z.string(),
});

interface MultiValueInputProps {
  externalForm: UseFormReturn<z.infer<typeof sendEmailSchema>>;
}
function MultiValueInput({ externalForm }: MultiValueInputProps) {
  const [value, setValue] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    console.log(newValue);
    if (newValue.endsWith(" ")) {
      console.log("space");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Input
        type="email"
        placeholder="hello@decoupled.dev"
        onChange={onChange}
        value={value}
        onKeyDown={(e) => {
          if (e.key === " ") {
            e.preventDefault();
            console.log("space");
            externalForm.setValue("emails", [
              ...externalForm.getValues("emails"),
              value,
            ]);
            setValue("");
          }
        }}
      />
      <div className="flex flex-wrap gap-2">
        {externalForm.watch("emails").map((value) => (
          <div
            key={value}
            className="border p-1 px-2 rounded flex gap-2 items-center justify-center text-sm"
          >
            {value}
            {/* button to remove */}
            <button
              onClick={() => {
                externalForm.setValue(
                  "emails",
                  externalForm.getValues("emails").filter((v) => v !== value)
                );
              }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
