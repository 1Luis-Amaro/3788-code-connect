import { useMutation, useQueryClient, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { Avatar } from "../Avatar";
import { Star } from "../icons/Star";
import styles from "./cardpost.module.css";
import Link from "next/link";
import { ThumbsUpButton } from "./ThumbsUpButton";
import { ModalComment } from "../ModalComment";

export const CardPost = ({
  post,
  highlight,
  rating,
  category,
  isFetching,
  currentPage,
}) => {
  const queryClient = useQueryClient();

  const thumbsMutation = useMutation({
    // Define a função que será executada quando a mutation for chamada
    mutationFn: (postData) => {
      // Faz uma requisição POST para a API
      return fetch("http://localhost:3000/api/thumbs", {
        method: "POST", // Tipo da requisição
        headers: { "Content-Type": "application/json" }, // Informa que o corpo da requisição é JSON
        body: JSON.stringify(postData), // Converte os dados para JSON
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status ${response.status}`);
        }
        return response.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["post", post.slug]);
      queryClient.invalidateQueries(["posts", currentPage]);
    },

    onError: (error, variables) => {
      console.log(`Erro ao salvar o thumbsUp para o slug: ${variables.slug} `, {
        error,
      });
    },
  });

  const submitCommentMutation = useMutation({
    mutationFn: (commentData) => {
      return fetch(`http://localhost:3000/api/comment/${post.id}`, {
        method:"POST",
        headers: { "Content-Type": "application/json" }, // Informa que o corpo da requisição é JSON
        body: JSON.stringify(commentData)
      })
    }
  })

  const onSubmitComment = (e) => {
   

    e.preventDefault()

    const formData = new FormData(e.target) //aqui pego os dados do formulario, e tenho acesso ao dado que quero com o e.target
    const text = formData.get("text") //extraio do formulario até realmente ter o texto

    submitCommentMutation.mutate({id: post.id, text})  //para perfomar a mutação
    
   
  }
  
  return (
    <article className={styles.card} style={{ width: highlight ? 993 : 486 }}>
      <header className={styles.header}>
        <figure style={{ height: highlight ? 300 : 133 }}>
          <Image
            src={post.cover}
            fill
            alt={`Capa do post de titulo: ${post.title}`}
          />
        </figure>
      </header>
      <section className={styles.body}>
        <h2>{post.title}</h2>
        <p>{post.body}</p>
        <Link href={`/posts/${post.slug}`}>Ver detalhes</Link>
      </section>
      <footer className={styles.footer}>
        <div className={styles.actions}>
          <form
            onClick={(e) => {
              e.preventDefault();
              thumbsMutation.mutate({ slug: post.slug });
            }}
          >
            <ThumbsUpButton disable={isFetching} />
            {thumbsMutation.isError && (
              <p className={styles.ThumbsUpButtonMessage}>
                Oops, ocorreu um erro ao salvar thumbsUp.
              </p>
            )}
            <p>{post.likes}</p>
          </form>
          <div>
            <ModalComment onSubmit={onSubmitComment} />
            <p>{post.comments?.length || 0}</p>
          </div>
          {rating && (
            <div style={{ margin: "0 3px" }}>
              <Star />
              <p style={{ marginTop: "1px" }}>{rating}</p>
            </div>
          )}
        </div>
        {category && (
          <div
            className={styles.categoryWrapper}
            style={{ fontSize: highlight ? "15px" : "12px" }}
          >
            <span className={styles.label}>Categoria: </span>{" "}
            <span className={styles.category}>{category}</span>
          </div>
        )}
        <Avatar imageSrc={post.author.avatar} name={post.author.username} />
      </footer>
    </article>
  );
};
