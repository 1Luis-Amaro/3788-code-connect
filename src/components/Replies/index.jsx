"use client";

import { useState } from "react";
import styles from "./replies.module.css";
import { Comment } from "../Comment";
import { ReplyModal } from "../ModalReply";
import { fetchReplices, useFetchReplices } from "@/hooks/useFetchReplies";
import { useQueryClient } from "@tanstack/react-query";


export const Replies = ({ comment, slug }) => {
  const queryClient = useQueryClient()

  const [showReplies, setShowReplies] = useState(false);

  const{data: replies} = useFetchReplices(showReplies ? {commentId: comment.id, slug} : {})

  const prefetch = () => {
    if (!showReplies){
      queryClient.prefetchQuery({
        queryKey: ["replies", comment.id, slug ],
        queryFn: () => fetchReplices({commentId: comment.id, slug}),
        retry:5,
        retryDelay: 500,
      })
    }
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.replies}>
        <button
          className={styles.btn}
          onClick={() => setShowReplies(!showReplies)}
          onMouseOver={prefetch}
        >
          {showReplies ? "Ocultar" : "Ver"} respostas
        </button>
        {showReplies && replies?.length && (
          <ul>
            {replies.map((reply) => (
              <li key={reply.id}>
                <Comment comment={reply} />
                <ReplyModal comment={reply} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
