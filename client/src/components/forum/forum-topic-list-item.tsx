import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, PinIcon, LockIcon, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ForumTopic } from "./forum-types";

interface ForumTopicListItemProps {
  topic: ForumTopic;
}

export default function ForumTopicListItem({ topic }: ForumTopicListItemProps) {
  // Function to parse date strings to Date objects if needed
  const parseDate = (dateValue: Date | string | null): Date | null => {
    if (!dateValue) return null;
    if (dateValue instanceof Date) return dateValue;
    try {
      return new Date(dateValue);
    } catch {
      return null;
    }
  };

  // Format dates for display
  const formattedDate = (date: Date | string | null): string => {
    const parsedDate = parseDate(date);
    if (!parsedDate) return "Unknown date";
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  };

  return (
    <Card className="overflow-hidden transition-all hover:border-primary/50">
      <Link href={`/forum/topics/${topic.id}`}>
        <a className="block">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center">
                  {topic.isPinned && <PinIcon className="mr-1 h-4 w-4 text-amber-500" />}
                  {topic.isLocked && <LockIcon className="mr-1 h-4 w-4 text-red-500" />}
                  <span>{topic.title}</span>
                </CardTitle>
                <CardDescription className="line-clamp-2">{topic.content}</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pb-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="flex items-center gap-1 px-2">
                <Eye className="h-3 w-3" />
                <span>{topic.views || 0}</span>
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 px-2">
                <MessageSquare className="h-3 w-3" />
                <span>{topic.postCount || 0}</span>
              </Badge>
            </div>
          </CardContent>

          <CardFooter className="pt-0 text-xs text-muted-foreground">
            <div className="flex w-full flex-col justify-between space-y-1 sm:flex-row sm:space-y-0">
              <div>
                Posted by {topic.user?.username || "Anonymous"} {formattedDate(topic.createdAt)}
              </div>
              {topic.lastPostAt && (
                <div>
                  Last reply {formattedDate(topic.lastPostAt)}
                </div>
              )}
            </div>
          </CardFooter>
        </a>
      </Link>
    </Card>
  );
}