import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabaseClient";
import type {
  ChatItemGroup,
  ChatMessageContent,
  MessageFromDB,
} from "@/types/chat"; // 타입 정의 경로 확인
import { Send } from "lucide-react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import ChatBubble from "./ChatBubble";

// getOrCreateUserId, getRandomUsername, transformMessagesForDisplay 함수는 이전과 동일
const getOrCreateUserId = (): string => {
  const cookieKey = "chat_user_id";
  let userId = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${cookieKey}=`))
    ?.split("=")[1];
  if (!userId) {
    userId = `usr_${Date.now().toString(36)}${Math.random()
      .toString(36)
      .substring(2, 7)}`;
    const expires = new Date(
      Date.now() + 365 * 24 * 60 * 60 * 1000
    ).toUTCString();
    document.cookie = `${cookieKey}=${userId}; path=/; expires=${expires}; SameSite=Lax`;
  }
  return userId;
};

const SKKU_MASCOTS_PREFIX = [
  "명륜에서 온",
  "율전에서 온",
  "고뇌하는",
  "열정적인",
  "코딩하는",
];
const SKKU_MASCOTS_SUFFIX = ["킹고", "금잔디", "명륜이", "율전이", "학우"];
const getRandomUsername = (userId: string): string => {
  const prefixIndex = userId.length % SKKU_MASCOTS_PREFIX.length;
  const suffixIndex =
    (userId.charCodeAt(0) + userId.length) % SKKU_MASCOTS_SUFFIX.length;
  const uniquePart = userId.substring(userId.length - 4, userId.length - 1);
  return `${SKKU_MASCOTS_PREFIX[prefixIndex]} ${SKKU_MASCOTS_SUFFIX[suffixIndex]} (${uniquePart})`;
};

const transformMessagesForDisplay = (
  messages: MessageFromDB[],
  currentUserId: string
): ChatItemGroup[] => {
  if (!messages || messages.length === 0) return [];
  const grouped: ChatItemGroup[] = [];
  let lastGroup: ChatItemGroup | null = null;
  messages.forEach((msg) => {
    const messageContentItem: ChatMessageContent = {
      id: msg.id,
      text: msg.content,
      time: new Date(msg.createdDatetime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };
    if (lastGroup && lastGroup.userId === msg.userId) {
      lastGroup.content.push(messageContentItem);
    } else {
      const newGroup: ChatItemGroup = {
        name: msg.username,
        userId: msg.userId,
        isCurrentUser: msg.userId === currentUserId,
        content: [messageContentItem],
      };
      grouped.push(newGroup);
      lastGroup = newGroup;
    }
  });
  return grouped;
};

interface ChatFieldProps {
  projectId: number;
}

export default function ChatField({ projectId }: ChatFieldProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastBubbleRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [rawMessages, setRawMessages] = useState<MessageFromDB[]>([]);
  const [displayedChats, setDisplayedChats] = useState<ChatItemGroup[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [currentUsername, setCurrentUsername] = useState<string>("");

  useEffect(() => {
    const userId = getOrCreateUserId();
    setCurrentUserId(userId);
    setCurrentUsername(getRandomUsername(userId));
  }, []);

  // 페칭 로직: 사용자가 제공한 "Message" 테이블 이름 유지
  useEffect(() => {
    if (!projectId || !currentUserId) return;

    const fetchInitialMessages = async () => {
      const { data, error } = await supabase
        .from("Message") // 사용자가 제공한 테이블 이름 "Message" 사용
        .select("id, content, userId, username, projectId, createdDatetime")
        .eq("projectId", projectId)
        .order("createdDatetime", { ascending: true });

      if (error) {
        console.error("Error fetching initial messages:", error.message);
        setRawMessages([]);
      } else {
        setRawMessages((data as MessageFromDB[]) || []);
      }
    };

    fetchInitialMessages();

    // 실시간 구독 로직: 사용자가 제공한 "Message" 테이블 이름 유지
    const channel = supabase
      .channel(`project-chat-room-${projectId}`)
      .on<MessageFromDB>(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message", // 사용자가 제공한 테이블 이름 "Message" 사용
          filter: `projectId=eq.${projectId}`,
        },
        (payload) => {
          // console.log("New message via Supabase (real-time):", payload.new);
          setRawMessages((prevMessages) => {
            if (prevMessages.some((m) => m.id === payload.new.id)) {
              return prevMessages;
            }
            return [...prevMessages, payload.new];
          });
        }
      )
      .subscribe((status, err) => {
        if (status === "SUBSCRIBED") {
          // console.log(`Successfully subscribed to project chat: ${projectId}`);
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          // console.error(
          //   `Supabase subscription error for project ${projectId}:`,
          //   err || status
          // );
        }
      });

    return () => {
      supabase.removeChannel(channel).catch(console.error);
    };
  }, [projectId, currentUserId]);

  useEffect(() => {
    if (currentUserId) {
      setDisplayedChats(
        transformMessagesForDisplay(rawMessages, currentUserId)
      );
    }
  }, [rawMessages, currentUserId]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector<HTMLDivElement>(
        "[data-radix-scroll-area-viewport]"
      );
      if (viewport) {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  };

  // --- 타이머 제거: displayedChats 변경 시 즉시 scrollToBottom 호출 ---
  useEffect(() => {
    scrollToBottom();
  }, [displayedChats]);
  // --- 타이머 제거 완료 ---

  // Optimistic Update 적용된 handleSendMessage
  const handleSendMessage = async () => {
    const textarea = textareaRef.current;
    if (!textarea || textarea.value.trim() === "") {
      textarea?.focus();
      return;
    }
    if (!projectId || !currentUserId || !currentUsername) {
      console.error("Chat prerequisites missing.");
      alert("메시지 전송 정보 부족. 새로고침 해주세요.");
      return;
    }

    const messageContent = textarea.value.trim();
    const tempId = `optimistic-${Date.now()}`;

    const optimisticMessage: MessageFromDB = {
      id: tempId,
      content: messageContent,
      userId: currentUserId,
      username: currentUsername,
      projectId: projectId,
      createdDatetime: new Date().toISOString(),
    };

    setRawMessages((prevMessages) => [...prevMessages, optimisticMessage]);

    textarea.value = "";
    textarea.style.height = "auto";
    textarea.focus();

    try {
      // 메시지 전송 로직: 사용자가 제공한 "Message" 테이블 이름 유지
      const { data: insertedData, error } = await supabase
        .from("Message") // 사용자가 제공한 테이블 이름 "Message" 사용
        .insert([
          {
            content: messageContent,
            userId: currentUserId,
            username: currentUsername,
            projectId: projectId,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (insertedData) {
        const confirmedMessage = insertedData as MessageFromDB;
        setRawMessages((prevMessages) =>
          prevMessages
            .map((msg) => (msg.id === tempId ? confirmedMessage : msg))
            .filter(
              (msg, index, self) =>
                index === self.findIndex((m) => m.id === msg.id)
            )
        );
      } else {
        console.warn(
          "Optimistic update: Inserted data not returned, relying on real-time for final state."
        );
      }
    } catch (error: any) {
      console.error(
        "Error sending message (Optimistic Update Rollback):",
        error.message
      );
      alert(`메시지 전송 오류: ${error.message}`);
      setRawMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== tempId)
      );
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextareaInput = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    event.target.style.height = "auto";
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  return (
    <div className="w-full h-[460px] flex flex-col bg-white border border-gray-300 rounded-md shadow-sm">
      <ScrollArea
        ref={scrollAreaRef}
        className="flex-grow h-[calc(100%-80px)] p-3"
      >
        <div className="flex flex-col gap-y-3">
          {displayedChats.map((chatGroup, groupIndex) => (
            <ChatBubble
              key={`${chatGroup.userId}-${groupIndex}-${chatGroup.content[0]?.id}`}
              chatGroup={chatGroup}
              ref={
                groupIndex === displayedChats.length - 1 ? lastBubbleRef : null
              }
            />
          ))}
        </div>
      </ScrollArea>

      <div className="w-full p-2 flex items-end border-t border-gray-200 bg-gray-50">
        <Textarea
          ref={textareaRef}
          name="text"
          className="flex-grow resize-none text-sm text-gray-800 font-medium mr-2 py-2 px-3 border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
          placeholder="메시지를 입력하세요..."
          rows={1}
          onInput={handleTextareaInput}
          onKeyDown={handleKeyDown}
        />
        <Button
          type="button"
          onClick={handleSendMessage}
          variant="secondary"
          className="w-8 h-8 rounded-full flex items-center justify-center"
          aria-label="Send message"
        >
          <Send className="size-5" />
        </Button>
      </div>
    </div>
  );
}
