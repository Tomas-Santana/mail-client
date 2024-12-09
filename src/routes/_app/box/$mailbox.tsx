import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import MailController from "@/api/controllers/MailController";
import { useEffect, useState } from "react";
import type { Mail } from "@/types/mail";
import { Link } from "@tanstack/react-router";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { SendDialog } from "@/components/send-form";

export const Route = createFileRoute("/_app/box/$mailbox")({
  component: RouteComponent,
});

//marked options

marked.use({
  gfm: true,
  breaks: true,
  pedantic: false,
  // links styles
});

function RouteComponent() {
  const params = Route.useParams();
  const mailboxQuery = useQuery({
    queryKey: ["mailbox", params.mailbox],
    queryFn: () => MailController.fetchEmail(params.mailbox),
  });
  const [selectedMessage, setSelectedMessage] = useState<Mail | null>(null);
  const isMailboxSelected = (mailbox: string) =>
    mailbox.toLowerCase() === params.mailbox.toLowerCase();

  useEffect(() => {
    console.log(mailboxQuery.data);
  }, [mailboxQuery.data]);
  return (
    <div className="flex flex-row">
      <div className="flex flex-col items-start justify-start p-4 border-r h-screen w-[450px]">
        <div className="flex flex-row justify-between w-full">
          <div className="flex gap-2">
            <Link
              to="/box/$mailbox"
              params={{ mailbox: "INBOX" }}
              className={`text-2xl ${isMailboxSelected("inbox") ? "font-semibold" : "text-gray-500"}`}
            >
              Inbox
            </Link>
            <Link
              to="/box/$mailbox"
              params={{ mailbox: "Sent" }}
              className={`text-2xl ${isMailboxSelected("sent") ? "font-semibold" : "text-gray-500"}`}
            >
              Sent
            </Link>
            {/* refresh button */}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => mailboxQuery.refetch()}
            >
              <RefreshCcw />
            </Button>
            <SendDialog />
          </div>
        </div>

        {mailboxQuery.isLoading && <div>Loading...</div>}
        {mailboxQuery.isError && <div>Error: {mailboxQuery.error.message}</div>}
        {mailboxQuery.isSuccess && (
          <MailList
            messages={mailboxQuery.data.messages}
            onMessageClick={(message) => setSelectedMessage(message)}
          />
        )}
      </div>
      <div className="flex flex-col items-start justify-start p-4 h-screen w-full">
        {selectedMessage ? (
          <MailView message={selectedMessage} />
        ) : (
          <div>Select a message</div>
        )}
      </div>
    </div>
  );
}

interface MailPreviewProps {
  message: Mail;
  onClick: () => void;
}
function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function MailPreview({ message, onClick }: MailPreviewProps) {
  const seen = false;
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      <div className="flex justify-between items-baseline mb-1">
        <span
          className={`break-words ${seen ? "text-gray-500" : "font-semibold text-gray-900"}`}
        >
          {truncate(message.from, 20)}
        </span>
        <span className="text-sm text-gray-500">
          {message.date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
        </span>
      </div>
      <div
        className={`mb-1 ${seen ? "text-gray-500" : "font-medium text-gray-800"}`}
      >
        {message.subject}
      </div>
      <div className="text-sm text-gray-600">{truncate(message.text, 100)}</div>
    </button>
  );
}

export function MailList({
  messages,
  onMessageClick,
}: {
  messages: Mail[];
  onMessageClick: (message: Mail) => void;
}) {
  return (
    <div className="space-y-2 min-w-sm max-w-sm">
      {messages
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .map((message) => (
          <MailPreview
            key={message.uid}
            message={message}
            onClick={() => onMessageClick(message)}
          />
        ))}
    </div>
  );
}

export function MailView({ message }: { message: Mail }) {
  return (
    <div className="p-4 w-full">
      <div className="flex justify-between items-baseline mb-4 gap-4 w-full">

        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">
            From: {message.from}
          </span>
          <span className="font-semibold text-gray-900">
            To: {message.to.join(", ")}
          </span>
        </div>
        <span className="text-sm text-gray-500">
          {message.date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
        </span>
      </div>
      <div className="flex flex-row gap-2">
        <div className="mb-4 font-medium text-gray-800 text-2xl">
          {message.subject}
        </div>

        <SendDialog replyTo={message}></SendDialog>
      </div>
      {/* add reply-to header if it exists */}
      {message.headers["reply-to"] && (
        <div className="text-sm text-gray-500">
          Reply to: {message.headers["reply-to"].join(", ")}
        </div>
      )}
      {/* // eslint-disable-next-line react/no-danger */}
      <div
        className="text-gray-700"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(
            marked.parse(message.text, {
              async: false,
            }) as string
          ),
        }}
      ></div>
    </div>
  );
}
