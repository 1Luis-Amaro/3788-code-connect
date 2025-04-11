import {useMutation} from "@tanstack/react-query"
import Image from "next/image";
import { Avatar } from "../Avatar";
import { Star } from "../icons/Star";
import styles from "./cardpost.module.css";
import Link from "next/link";
import { ThumbsUpButton } from "./ThumbsUpButton";
import { ModalComment } from "../ModalComment";

export const CardPost = ({ post, highlight, rating, category, isFetching }) => {

  const thumbsMutation = useMutation({
    // Define a função que será executada quando a mutation for chamada
    mutationFn: (postData) => {
      // Faz uma requisição POST para a API
      return fetch("http://localhost:3000/api/thumbs", {
        method: "POST", // Tipo da requisição
        headers: { "Content-Type": "application/json" }, // Informa que o corpo da requisição é JSON
        body: JSON.stringify(postData), // Converte os dados para JSON
      });
    },
  });
  
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
          <form onClick={(e) => {
              e.preventDefault();
              thumbsMutation.mutate({slug: post.slug})
          } } >
            <ThumbsUpButton disable={isFetching} />
            <p>{post.likes}</p>
          </form>
          <div>
            <ModalComment />
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
