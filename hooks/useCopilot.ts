import { useCallback, useState } from "react";

interface CopilotResponse {
  success: boolean;
  data?: {
    conversationId: string;
    parts: Array<{
      type: string;
      text: string;
    }>;
  };
  message?: string;
  error?: string;
}

export const useCopilot = () => {
  const [conversationId, setConversationId] = useState<string | null>(null);

  const generateCopilotResponse = async ({
    message,
    messages,
    searchEnabled,
  }: {
    message?: any;
    messages?: any;
    searchEnabled?: any;
  }) => {
    console.log("useCopilot: generateCopilotResponse: start", messages);
    const url = `http://localhost:8888/api/copilot/chat`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // message,
        messages,
      }),
    });

    const jsonData = await response.json();

    const texts = jsonData?.data?.parts
      ?.filter((part: any) => part.type === "text")
      .map((part: any) => part.text)
      .join("\n");

    console.log(jsonData?.data);
    return texts || "Sorry, I couldn't process your request.";
  };

  // const generateCopilotResponse = useCallback(
  //   async (
  //     userMessage: string,
  //     options?: {
  //       conversationId?: string;
  //       searchEnabled?: boolean;
  //     }
  //   ): Promise<string> => {
  //     try {
  //       const response = await fetch("/api/copilot/chat", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           message: userMessage,
  //           conversationId: options?.conversationId || conversationId,
  //           searchEnabled: options?.searchEnabled || false,
  //         }),
  //       });

  //       if (response.ok) {
  //         const data: CopilotResponse = await response.json();

  //         if (data.success && data.data) {
  //           // Update conversation ID for future messages
  //           setConversationId(data.data.conversationId);

  //           // Extract text from parts array
  //           const textParts = data.data.parts
  //             .filter((part) => part.type === "text")
  //             .map((part) => part.text)
  //             .join(" ");

  //           return (
  //             textParts ||
  //             "I received your message but couldn't generate a response."
  //           );
  //         } else {
  //           throw new Error(data.message || "Copilot API call failed");
  //         }
  //       } else {
  //         const errorData = await response.json().catch(() => ({}));
  //         throw new Error(
  //           errorData.message ||
  //             `HTTP ${response.status}: Copilot API call failed`
  //         );
  //       }
  //     } catch (error) {
  //       console.error("Copilot error:", error);
  //       return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again.";
  //     }
  //   },
  //   [conversationId]
  // );

  const resetConversation = useCallback(() => {
    setConversationId(null);
  }, []);

  return {
    generateCopilotResponse,
    conversationId,
    resetConversation,
  };
};
