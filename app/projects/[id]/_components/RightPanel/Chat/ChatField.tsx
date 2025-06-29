import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import apiClient, { PublicProjectWithForeignKeys } from "@/lib/apiClientHelper";
import { supabase } from "@/lib/supabaseClient";
import type {
  ChatItemGroup,
  ChatMessageContent,
  MessageFromDB,
} from "@/types/chat"; // 타입 정의 경로 확인
import { Send } from "lucide-react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import ChatBubble from "./ChatBubble";

const COOKIE_KEY = "chat_user_data";

const getOrCreateUserId = (): string => {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_KEY}=`))
    ?.split("=")[1];

  if (cookieValue) {
    // 기존 쿠키가 있으면 userId만 반환 (nickname, major는 별도로 파싱)
    const [userId] = cookieValue.split(",");
    return userId;
  } else {
    // 새로운 userId 생성
    const userId = `usr_${Date.now().toString(36)}${Math.random()
      .toString(36)
      .substring(2, 7)}`;
    return userId;
  }
};

const saveChatUserData = (
  userId: string,
  nickname: string,
  major: string
): void => {
  const cookieValue = `${userId},${nickname},${major}`;
  const expires = new Date(
    Date.now() + 365 * 24 * 60 * 60 * 1000
  ).toUTCString();
  document.cookie = `${COOKIE_KEY}=${cookieValue}; path=/; expires=${expires}; SameSite=Lax`;
};

const getChatUserData = (): {
  userId: string;
  nickname: string;
  major: string;
} | null => {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_KEY}=`))
    ?.split("=")[1];

  if (cookieValue) {
    const [userId, nickname, major] = cookieValue.split(",");
    if (userId && nickname && major) {
      return { userId, nickname, major };
    }
  }
  return null;
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
        name: `${msg.nickname}(${msg.major})`,
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
  project: PublicProjectWithForeignKeys;
}

export default function ChatField({ project }: ChatFieldProps) {
  const projectId = project.id;
  const [open, setOpen] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastBubbleRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [rawMessages, setRawMessages] = useState<MessageFromDB[]>([]);
  const [displayedChats, setDisplayedChats] = useState<ChatItemGroup[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [currentMajor, setCurrentMajor] = useState<string>("");
  const [currentNickname, setCurrentNickname] = useState<string>("");

  function enterChatRoom(isAdmin: boolean, major: string, nickname: string) {
    let userId = "";
    if (!isAdmin) {
      userId = getOrCreateUserId();
    } else {
      userId = "admin";
    }
    setCurrentUserId(userId);
    setCurrentMajor(major);
    setCurrentNickname(nickname);
    saveChatUserData(userId, nickname, major);
  }

  // 페이지 로드시 자동으로 채팅 참여
  useEffect(() => {
    (async () => {
      const currentPassword = localStorage.getItem(
        `currentPassword/${projectId}`
      );
      if (currentPassword) {
        const isVerified = await apiClient.verifyProjectPassword(
          projectId,
          currentPassword
        );
        if (isVerified) {
          enterChatRoom(true, project.proposerName, "관리자");
          return;
        }
      }
      const chatUserData = getChatUserData();
      if (chatUserData) {
        enterChatRoom(false, chatUserData.major, chatUserData.nickname);
      }
    })();
  }, [projectId, project.proposerName]);

  useEffect(() => {
    const fetchInitialMessages = async () => {
      const { data, error } = await supabase
        .from("Message") // 사용자가 제공한 테이블 이름 "Message" 사용
        .select(
          "id, content, userId, major, nickname, projectId, createdDatetime"
        )
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
          setRawMessages((prevMessages) => {
            if (prevMessages.some((m) => m.id === payload.new.id)) {
              return prevMessages;
            }
            return [...prevMessages, payload.new];
          });
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        }
      });

    return () => {
      supabase.removeChannel(channel).catch(console.error);
    };
  }, [projectId]);

  useEffect(() => {
    setDisplayedChats(transformMessagesForDisplay(rawMessages, currentUserId));
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

  useEffect(() => {
    scrollToBottom();
  }, [displayedChats]);

  const handleSendMessage = async () => {
    const textarea = textareaRef.current;
    if (!textarea || textarea.value.trim() === "") {
      textarea?.focus();
      return;
    }
    if (!projectId || !currentUserId || !currentMajor || !currentNickname) {
      setOpen(true);
      return;
    }

    const messageContent = textarea.value.trim();
    const tempId = `optimistic-${Date.now()}`;

    const optimisticMessage: MessageFromDB = {
      id: tempId,
      content: messageContent,
      userId: currentUserId,
      major: currentMajor,
      nickname: currentNickname,
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
            major: currentMajor,
            nickname: currentNickname,
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "Error sending message (Optimistic Update Rollback):",
          error.message
        );
        alert(`메시지 전송 오류: ${error.message}`);
        setRawMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== tempId)
        );
      }
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
        <Dialog
          open={open}
          onOpenChange={(open) => {
            // 인증 정보가 입력됐다면 열지 않음
            if (open && currentMajor !== "" && currentNickname !== "") {
              return;
            }
            setOpen(open);
          }}
        >
          <DialogTrigger asChild>
            <Textarea
              ref={textareaRef}
              name="text"
              className="flex-grow resize-none text-sm text-gray-800 font-medium mr-2 py-2 px-3 border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
              placeholder="프로젝트에 관심있는 학생들과 자유롭게 대화해보세요!"
              rows={1}
              onInput={handleTextareaInput}
              onKeyDown={handleKeyDown}
            />
          </DialogTrigger>
          <DialogContent className="w-96">
            <DialogTitle>채팅 참여</DialogTitle>
            <DialogDescription asChild>
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium text-gray-700">
                  별명
                </Label>
                <Input
                  type="text"
                  value={currentNickname}
                  onChange={(e) => setCurrentNickname(e.target.value)}
                  placeholder="별명을 입력하세요"
                />
                <Label className="text-sm font-medium text-gray-700">
                  학과
                </Label>
                <Input
                  type="text"
                  value={currentMajor}
                  onChange={(e) => setCurrentMajor(e.target.value)}
                  placeholder="학과를 입력하세요"
                />
              </div>
            </DialogDescription>
            <div className="flex justify-end mt-4">
              <DialogClose asChild>
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  취소
                </Button>
              </DialogClose>
              <Button
                className="ml-2"
                onClick={() => {
                  enterChatRoom(false, currentMajor, currentNickname);
                  setOpen(false);
                }}
              >
                참여하기
              </Button>
            </div>
          </DialogContent>
        </Dialog>

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
