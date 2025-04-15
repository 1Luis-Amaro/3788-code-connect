"use client";

import { useRef, useState } from "react";
import { Modal } from "../Modal";
import styles from "./replymodal.module.css";
import { Textarea } from "../Textarea";
import { SubmitButton } from "../SubmitButton";
import { Comment } from "../Comment";
import { useReplyMutation } from "@/app/hooks/useReplyMutation";

export const ReplyModal = ({ comment, slug }) => {
  const modalRef = useRef(null);

  const {mutate, isSuccess} = useReplyMutation(slug)

  const [comentario, setComentario] = useState(" ") 

  const openModal = () => {
    setComentario("");
    modalRef.current.openModal();
  };

  const closeModal = () => {
    modalRef.current.closeModal();
  };


  const onSubmitCommentReply = (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const text = formData.get("text")

    mutate({comment, text})
  }

  if (isSuccess) {
    closeModal()
  }

  return (
    <>
      <Modal ref={modalRef}>
        <form onSubmit={onSubmitCommentReply} >
          <div className={styles.body}>
            <Comment comment={comment} />
          </div>
          <div className={styles.divider}></div>
          <Textarea
            required
            rows={8}
            name="text"
            placeholder="Digite aqui..."
            value = { comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
          <div className={styles.footer}>
            <SubmitButton>Responder</SubmitButton>
          </div>
        </form>
      </Modal>
      <button className={styles.btn} onClick={openModal}>
        Responder
      </button>
    </>
  );
};
